---
title: Spring Learning
description: Spring 框架学习的一些笔记，待整理。
date: 2026-04-27
category: 学习笔记
---

# Spring-Framework

## IoC容器

Inversion of Control，控制反转，使得程序的控制权由程序转移到了 IoC 容器，所有组件不再由程序自己创建和配置，而是由容器负责，并管理组件的生命周期

- 无侵入容器：应用的组件无需实现 Spring 的接口
  - 既可以在容器中运行，也可以自行组装
  - 测试的时候不依赖 Spring 容器，可单独进行测试

- **依赖注入**：容器自动将依赖对象注入到目标 Bean 中，是 IoC 的一种实现方式，通过反射机制实现

- Spring 支持的4种依赖注入模式：

  1. 构造方法注入，例如：

    ```java
    @Component
    public class Hello {
        JdbcTemplate jdbcTemplate;
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

  3. Setter方法注入，例如：

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

  4. 字段注入，例如：

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

    - 通过三级缓存（1.singletonObjects<-2.earlySingletonObjects<-3.singletonFactoryies），三级缓存为了处理 AOP 代理

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
  - 在配置类`@Configuration`使用`@PropertySource("app.properties")`读取配置文件，然后使用`@Value("${app.key:"默认值"}")`来注入到变量中

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
      - 实现`DisposableBean` 接口的 `destroy` 方法。
      - 在配置中指定 `destroy-method`。
    - 容器关闭时 Bean 被销毁
  
- BeanPostProcessor：一种特殊的 bean，作用是根据条件替换某些 bean，如把原始 Bean 替换为代理后的 Bean ，原来的 Bean 替换后不再受 IoC 容器管理

  - 一个Bean如果被Proxy替换，则依赖它的Bean应注入Proxy
  - 一个Bean如果被Proxy替换，如果要注入依赖，则应该注入到原始对象
  
- 在 Spring 中，BeanPostProcessor 的优先度似乎是最高的，但是在 Tsuki 中，按照的是 @Component（包括@Component构造函数中的依赖）-> BeanPostProcessor -> @Component 来加载的
- - -