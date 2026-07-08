---
title: Spring Learning
description: Spring 框架学习笔记
date: 2026-04-27
last_update: 2026-07-06
tags: [Spring, Java, SpringBoot, SpringCloud, MyBatis]
category: 学习笔记
---

# Spring-Framework

## Spring

### Spring 的核心特性

- **IoC 容器**：通过控制反转容器实例化对象，让容器来管理对象的生命周期与依赖。
- **AOP**：面向切面编程。如果被代理对象实现了接口，Spring AOP 默认会使用 JDK Proxy 创建代理对象；如果没有实现接口，则会使用 CGLIB 生成被代理对象的子类作为代理。
- **事务管理**：提供一致的事务管理接口，支持声明式（`@Transactional`）和编程式事务（`TransactionTemplate`或者`PlatformTransactionManager`）
- **MVC 框架**：基于 Servlet API 构建的 Web 框架，采用"模型-视图-控制器"的 MVC 架构

### IoC容器

Inversion of Control，控制反转，使得程序的控制权由程序转移到了 IoC 容器，所有组件不再由程序自己创建和配置，而是由容器负责，并管理组件的生命周期

- 无侵入容器：应用的组件无需实现 Spring 的接口
  - 既可以在容器中运行，也可以自行组装
  - 测试的时候不依赖 Spring 容器，可单独进行测试

- **依赖注入**：容器自动将依赖对象注入到目标 Bean 中，是 IoC 的一种实现方式，通过反射机制实现

- Spring 支持的4种依赖注入模式：

  1. 构造方法注入，保证对象初始化时依赖就绪

    ```java
    @Component
    public class Hello {
        JdbcTemplate jdbcTemplate;
        // @Autowired 可以省去
        public Hello(@Autowired JdbcTemplate jdbcTemplate) {
            this.jdbcTemplate = jdbcTemplate;
        }
    }
    ```

  2. 工厂方法注入（在别的配置类中调用构造器创建），例如：

    ```java
    @Configuration
    public class AppConfig {
        @Bean
        Hello hello(@Autowired JdbcTemplate jdbcTemplate) {
            return new Hello(jdbcTemplate);
        }
    }
    ```

  3. Setter方法注入，灵活性高

    ```java
    @Component
    public class Hello {
        JdbcTemplate jdbcTemplate;
    
        @Autowired
        void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
            this.jdbcTemplate = jdbcTemplate;
        }
    }
    ```

  4. 字段注入，简洁但是隐藏依赖关系，不推荐生产代码

    ```java
    @Component
    public class Hello {
        @Autowired
        JdbcTemplate jdbcTemplate;
    }
    ```

  - 这4种注入方式实际上是有区别的：

    - 前两种方式，即构造方法注入和工厂方法注入，Bean的创建与注入是一体的，我们无法把它们分成两个阶段，因为无法中断方法内部代码的执行。称为**强依赖**，强依赖不能存在循环依赖，会报错。
    - 后两种方式，即Setter方法注入和属性注入，Bean的创建与注入是可以分开的，即先创建Bean实例，再用反射调用方法或字段，完成注入。称为**弱依赖**。
    
  - Spring 解决**循环依赖**的方法（只能解决 singleton 模式，字段/Setter 注入的循环依赖，多例模式每次都创建新对象，不使用缓存）

    - 通过三级缓存（1.singletonObjects←2.earlySingletonObjects←3.singletonFactories），三级缓存为了处理 AOP 代理

      ```java
      @Component
      class A {
          @Autowired
          B b;
      }
      @Component
      class B {
          @Autowired
          A a;
      }
      ```

      解决循环依赖的完整执行流程：

      1. 创建 A
         - 实例化 A （调用构造方法）
         - 把 A 的工厂对象放入三级缓存
         - 开始填充属性：b 不存在，创建 B
      2. 创建 B
         - 实例化 B
         - 把 B 的工厂对象放入三级缓存
         - 开始填充属性：从三级缓存中拿到 a，取出并升级到二级缓存
         - B 成功完成初始化，放入一级缓存
      3. 回到 A
         - A 拿到创建好的 B
         - A 成功完成初始化，放入一级缓存
      4. 解决！

    > **为什么三级缓存不行，二级缓存够吗？**
    > 
    > 不够。核心是为了正确处理需要 **AOP 代理** 的 Bean。如果只有二级缓存，当 B 注入 A 时拿到的原始对象，但 A 初始化后生成的是代理对象——同一个 Bean 出现两个不同实例，违反单例约束。三级缓存的 ObjectFactory 能智能判断：需要代理就提前生成代理对象放入二级缓存，不需要代理就返回原始对象，保证对象全局唯一。

    - 三级缓存数据结构：
      - 一级缓存 `singletonObjects`：`Map<String, Object>`，完全初始化好的 Bean
      - 二级缓存 `earlySingletonObjects`：`Map<String, Object>`，早期引用（原始对象或提前生成的代理）
      - 三级缓存 `singletonFactories`：`Map<String, ObjectFactory<?>>`，ObjectFactory 工厂函数

- BeanFactory：延迟创建Bean（第一次获取按需创建），是 Spring 的底层容器

- ApplicationContext：启动时初始化所有Bean，BeanFactory的子接口，提供额外功能如国际化支持、时间和通知机制

- Spring的配置方式

  - XML：通过<bean>标签来定义，Spring 容器通过读取 XML 配置提取标签信息，使用反射创建对象、注入依赖，然后将 Bean 存入容器缓存，统一管理生命周期
  - 自动扫描包：通过XML中<context:component-scan base-package="org.example"/>配置
  - Annotation：通过`@ComponentScan`注解自动扫描（Spring boot 主要用这种）

- Bean 的作用域

  - 单例（Singleton）：容器全局唯一
  - 多例（Prototype）：每次获取都创建新实例
  - request：一次 HTTP 请求中有效
  - session：一次用户会话内有效
  - application：整个 ServletContext 声明周期有效
  - websocket：WebSocket 会话内有效

- 把类声明为 Bean 的注解

  - `@Component`：通用组件
  - `@Repository`：数据访问层（DAO）
  - `@Service`：业务逻辑层
  - `@Controller/@RestController`：控制层
  - `@Configuration`：配置类

- 使用 FactoryBean 创建 Bean：需要实现接口

  ```java
  @Component
  public class ZoneIdFactoryBean implements FactoryBean<ZoneId> {
  
      String zone = "Z";
  
      @Override
      public ZoneId getObject() throws Exception {
          return ZoneId.of(zone);
      }
  
      // 指定创建的 Bean 的类型
      @Override
      public Class<?> getObjectType() {
          return ZoneId.class;
      }
  }
  ```

  本质上`@Bean`方法就是工厂方法（加在方法上，让方法返回的对象变成 Bean），可以用来把第三方的库变成 Bean，或者手动控制 Bean 的创建方式

- 注入配置或者资源文件

  - 在声明Resource类对象时使用注解`@Value("classpath:/test.file")`定位文件并注入，classpath 为 `src/main/resources`
  - 在配置类`@Configuration`使用`@PropertySource("app.properties")`读取配置文件，然后使用`@Value("${app.key:\"默认值\"}")`来注入到变量中

- Bean 的生命周期

  - 创建过程
    - 实例化，分配内存空间
    - 填充属性（DI 注入依赖）：构造器注解、`@Autowired`、或 XML 配置
    - 执行前置初始化方法：通过实现 `BeanPostProcessor` 的 `postProcessBeforeInitialization` 方法。
    - 执行初始化方法，如`@PostConstruct`注解
    - 执行后置处理器：通过实现 `BeanPostProcessor` 的 `postProcessAfterInitialization` 方法。
    - Bean 创建完成，可使用
  - 销毁过程
    - 执行销毁方法
      - `@PreDestroy` 注解。
      - 若实现了实现`DisposableBean` 接口，调用其 `destroy` 方法。
      - 调用在配置中指定的 `destroy-method`。
    - 容器关闭时 Bean 被销毁

- Bean 的单例与非单例生命周期差异

| 阶段 | 单例 (Singleton) | 原型 (Prototype) |
|------|-----------------|-----------------|
| 创建时机 | 容器启动或首次请求 | 每次请求创建新实例 |
| 初始化流程 | 完整执行 | 完整执行（仅到初始化完成） |
| 销毁时机 | 容器关闭时销毁 | 容器不管理，需调用者自行释放 |
| 内存 | 常驻内存，注意线程安全 | 每次创建新实例，开销较大 |

- BeanPostProcessor：一种特殊的 bean，作用是根据条件替换某些 bean，如把原始 Bean 替换为代理后的 Bean ，原来的 Bean 替换后不再受 IoC 容器管理

  - 一个Bean如果被Proxy替换，则依赖它的Bean应注入Proxy
  - 一个Bean如果被Proxy替换，如果要注入依赖，则应该注入到原始对象
  
- 在 Spring 中，BeanPostProcessor 的优先度似乎是最高的，但是在 Tsuki 中，按照的是 @Component（包括@Component构造函数中的依赖）-> BeanPostProcessor -> @Component 来加载的
- - -

### AOP

#### 相关概念

- **Aspect**：切面，是 Join point，Advice，Pointcut 的统称
- **Join point**：连接点，如方法调用、异常处理等
- **Advice**：通知，即定义的一个切面中的横切逻辑，包含 `before`、`after`、`after-returning`、`after-throwing`、`around` 五种类型。在很多的 AOP 实现框架中，Advice 通常作为一个拦截器，也可以包含许多个拦截器作为一条链路围绕着 Join point 进行处理。
- **Pointcut**：切点
- **Introduction**：引介，让一个切面可以声明被通知的对象实现任何他们没有真正实现的额外的接口。例如可以让一个代理对象代理两个目标类。
- **Weaving**：织入，在有了连接点、切点、通知以及切面，如何将它们应用到程序中呢？没错，就是织入，在切点的引导下，将通知逻辑插入到目标方法上，使得我们的通知逻辑在方法调用时得以执行。
- **AOP proxy**：AOP 代理，指在 AOP 实现框架中实现切面协议的对象。在 Spring AOP 中有两种代理，分别是 JDK 动态代理和 CGLIB 动态代理。
- **Target object**：目标对象，就是被代理的对象。

**AOP 的常见应用**：将与业务无关却为业务模块共同调用的逻辑和责任封装起来，减少重复代码，降低模块耦合度

1. **事务管理**：如声明式事务 @Transactional
2. **日志记录**：通过`@Before`获取入参，`@AfterReturning`获取返回值，`@Around`统计执行时间
3. **权限校验**：鉴权

> **AOP 的边界**：只能作用在 Spring 容器管理的 Bean 上，自己 new 的对象不会生效；同类内部方法调用不触发 AOP（走 this，绕过代理）；只能拦截方法级别，不能拦截字段或构造方法级别。

#### 常用注解

- @Aspect：用于定义切面，标注在切面类上。
- @Pointcut：定义切点，标注在方法上，用于指定连接点。
- @Before：在方法执行之前执行通知。
- @After：在方法执行之后执行通知（无论方法正常返回还是抛出异常）。
- @Around：在方法执行前后都执行通知，是功能最强的一种。
- @AfterReturning：在方法正常返回结果后执行通知。
- @AfterThrowing：在方法抛出异常后执行通知。

#### Spring 中 AOP 的实现

> 自 Spring Boot 2.0 起，默认配置 `spring.aop.proxy-target-class=true`，即无论是否实现接口都优先使用 CGLIB，如需切回 JDK 动态代理需手动设为 false。

基于动态代理：

- **基于接口的代理**（JDK动态代理）： 这种类型的代理要求目标对象必须实现至少一个接口（因为代理类必须要继承 Proxy 类，因此只能实现目标对象的全部接口，并且构造器必须传入 InvocationHandler）。Java动态代理会创建一个实现了相同接口的代理类，然后在运行时动态生成该类的实例。这种代理的实现核心是`java.lang.reflect.Proxy`类和`java.lang.reflect.InvocationHandler`接口。每一个动态代理类都必须实现`InvocationHandler`接口，并且每个代理类的实例都关联到一个`handler`。当通过代理对象调用一个方法时，这个方法的调用会被转发为由`InvocationHandler`接口的`invoke()`方法来进行调用。

- **基于类的代理**（CGLIB动态代理）： CGLIB（Code Generation  Library）在运行时动态生成一个目标类的子类。CGLIB代理不需要目标类实现接口，而是通过继承的方式创建代理类。因此，如果目标对象没有实现任何接口，可以使用CGLIB来创建动态代理。

#### 静态代理 vs 动态代理

| 特性 | 静态代理 | 动态代理 |
|------|---------|---------|
| 创建时机 | 代码编译时确定 | 代码运行期间由 JVM 自动生成 |
| 代理范围 | 通常只代理一个类 | 不需要为每个被代理类手写代理类 |
| 实现方式 | 手动创建 | JDK（基于接口）或 CGLIB（基于继承） |

### Spring 框架中用到的设计模式

- **工厂设计模式** : Spring使用工厂模式通过 BeanFactory、ApplicationContext 创建 bean 对象。
- **代理设计模式** : Spring AOP 功能的实现。
- **单例设计模式** : Spring 中的 Bean 默认都是单例的。
- **模板方法模式** : Spring 中 jdbcTemplate、hibernateTemplate 等以 Template 结尾的对数据库操作的类，它们就使用到了模板模式。
- **包装器设计模式** : 我们的项目需要连接多个数据库，而且不同的客户在每次访问中根据需要会去访问不同的数据库。这种模式让我们可以根据客户的需求能够动态切换不同的数据源。
- **观察者模式:** Spring 事件驱动模型 ApplicationEvent 是观察者模式很经典的一个应用。
- **适配器模式** :Spring AOP 的增强或通知(Advice)使用到了适配器模式、spring MVC 中也是用到了适配器模式适配Controller。

- 

---
Spring 事务什么时候会失效？

| 原因 | 说明 |
|------|------|
| **异常被 try-catch 吞掉** | 捕获了异常却没再抛出，代理感知不到异常 |
| **抛出受检异常（Checked Exception）** | Spring 默认只对 `RuntimeException` 和 `Error` 回滚，需 `@Transactional(rollbackFor = Exception.class)` |
| **事务传播属性设置不当** | 事务嵌套时传播属性配置不正确 |
| **多数据源管理不当** | 多个数据源事务配置不正确 |
| **同类内部方法调用（this 调用）** | 绕过了代理对象，事务注解不生效 |
| **非 public 方法** | `@Transactional` 标注在私有或非 public 方法上 |

Spring 的扩展

- **BeanFactoryPostProcessor**：实例化 Bean 前修改 Bean 的定义
- **BeanPostProcessor**：Bean 实例化、配置及初始化后进行额外处理
- **PropertySource**：定义不同的属性源
- **ImportSelector / ImportBeanDefinitionRegistrar**：根据条件动态注册 Bean 定义
- **HandlerInterceptor**：拦截 Spring MVC 请求处理
- **@ControllerAdvice**：全局异常处理、数据绑定

---

### SpringMVC

#### MVC 分层介绍

**MVC** = Model（模型） + View（视图） + Controller（控制器）

- **View（视图）**：为用户提供使用界面，与用户直接交互
- **Model（模型）**：存取数据的 POJO，分为数据承载 Bean（实体类）和业务处理 Bean（Service/DAO）
- **Controller（控制器）**：将用户请求转发给相应 Model 处理，并根据计算结果提供响应

**流程**：用户通过 View 请求 → Controller 接收解析 → 找到相应 Model 处理 → 结果返回 Controller → 渲染 View 页面并响应

#### Spring MVC 处理流程

```
① 用户发送请求 → DispatcherServlet（前端控制器）
② DispatcherServlet → HandlerMapping（处理器映射器）
③ HandlerMapping 根据 URL 找到具体处理器，返回 HandlerExecutionChain
④ DispatcherServlet → HandlerAdapter（处理器适配器）
⑤ HandlerAdapter 执行 Handler（Controller）
⑥ Handler 返回 ModelAndView
⑦ HandlerAdapter 将 ModelAndView 返回 DispatcherServlet
⑧ DispatcherServlet → ViewResolver（视图解析器）
⑨ ViewResolver 返回具体 View
⑩ DispatcherServlet 渲染视图（模型数据填充至视图）
⑪ DispatcherServlet 响应用户
```

---

## Spring Boot

### 为什么使用 Spring Boot？

- **简化开发**：开箱即用的组件和自动配置
- **快速启动**：内嵌 Tomcat/Jetty/Undertow，无需额外部署
- **自动化配置**：根据依赖和约定自动配置应用

### 约定大于配置

Spring Boot 的核心设计理念：

1. **自动化配置**：引入 `spring-boot-starter-web` 后自动配置内嵌 Tomcat 和 Spring MVC
2. **默认配置**：日志、数据库连接等常用配置已预设好
3. **约定项目结构**：主类置于根包，控制器、服务、数据访问类放在对应子包

### Spring Boot 自动装配原理

**核心注解**：`@SpringBootApplication` 包含 `@EnableAutoConfiguration`

**执行流程**：

```java
@SpringBootApplication
  ├── @EnableAutoConfiguration
  │     └── @Import(AutoConfigurationImportSelector.class)
  │           └── selectImports()
  │                 ├── ① 扫描类路径元数据文件
  │                 │     - 2.7以前: META-INF/spring.factories
  │                 │     - 2.7+: META-INF/spring/.../AutoConfiguration.imports
  │                 │     - 3.0: 完全移除 spring.factories 支持
  │                 ├── ② 条件判断（@ConditionalOnClass 等）
  │                 └── ③ 满足条件的自动配置类导入 Spring 容器
  └── @ComponentScan：组件扫描
```

SpringBoot 启动时扫描 jar 包中的自动配置元数据文件，将配置的类信息加载到 Spring 容器，按条件判断是否启用。

### 常用 Starter

| Starter | 说明 |
|---------|------|
| `spring-boot-starter-web` | Spring MVC + Tomcat |
| `spring-boot-starter-security` | Spring Security 认证授权 |
| `mybatis-spring-boot-starter` | MyBatis 集成 |
| `spring-boot-starter-data-jpa` | JPA/Hibernate |
| `spring-boot-starter-data-redis` | Redis（Lettuce 客户端） |
| `spring-boot-starter-test` | JUnit + Spring Test + AssertJ |

### SpringBoot 过滤器 vs 拦截器

| 特性 | 过滤器（Filter） | 拦截器（Interceptor） |
|------|-----------------|---------------------|
| 规范 | Servlet 规范 | Spring MVC 框架 |
| 范围 | 全局（含静态资源） | 仅 Controller 层 |
| 顺序 | Servlet 之前 | DispatcherServlet 之后 |
| 依赖注入 | 不支持直接注入 | 支持 |
| 适用场景 | 编码、日志、安全 | 权限、参数校验 |

**完整链路**：`Filter → DispatcherServlet → Interceptor.preHandle → Controller → Interceptor.postHandle → View → Interceptor.afterCompletion`

### Spring Boot 用到的设计模式

- **代理模式**：Spring 的 AOP 通过动态代理实现方法级别的切面增强，有静态和动态两种代理方式，采用动态代理方式。
- **策略模式**：Spring AOP 支持 JDK 和 Cglib 两种动态代理实现方式，通过策略接口和不同策略类，运行时动态选择，其创建一般通过工厂方法实现。
- **装饰器模式**：Spring 用 TransactionAwareCacheDecorator 解决缓存与数据库事务问题增加对事务的支持。
- **单例模式**：Spring Bean 默认是单例模式，通过单例注册表（如 HashMap）实现。
- **简单工厂模式**：Spring 中的 BeanFactory 是简单工厂模式的体现，通过工厂类方法获取 Bean 实例。
- **工厂方法模式**：Spring中的 FactoryBean 体现工厂方法模式，为不同产品提供不同工厂。
- **观察者模式**：Spring 观察者模式包含 Event 事件、Listener 监听者、Publisher 发送者，通过定义事件、监听器和发送者实现，观察者注册在  ApplicationContext 中，消息发送由 ApplicationEventMulticaster 完成。
- **模板模式**：Spring Bean 的创建过程涉及模板模式，体现扩展性，类似 Callback 回调实现方式。
- **适配器模式**：Spring MVC 中针对不同方式定义的 Controller，利用适配器模式统一函数定义，定义了统一接口 HandlerAdapter 及对应适配器类。

---

## MyBatis

### MyBatis 优点

- **SQL 灵活可控**：SQL 写在 XML，解除与代码的耦合
- **相较 JDBC 减少 50%+ 代码**：消除大量冗余代码
- **兼容性好**：只要是 JDBC 支持的数据库都可以
- **与 Spring 集成好**

### #{} 和 ${} 的区别

| 特性 | `#{}` | `${}` |
|------|-------|-------|
| SQL 处理 | 预编译替换为 `?` | 直接拼入参数 |
| SQL 注入 | 防止 | 不能防止 |
| 效率 | 高 | 低 |
| 适用 | 参数值 | 动态表名/列名 |

### MyBatis 用到的设计模式

- **建造者模式**：SqlSessionFactoryBuilder
- **工厂模式**：SqlSessionFactory
- **代理模式**：MapperProxy（JDK 动态代理）
- **模板方法模式**：BaseExecutor
- **适配器模式**：Log 接口适配各种日志框架
