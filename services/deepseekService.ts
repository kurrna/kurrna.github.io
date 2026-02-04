import { EXPERIENCE, PROFILE, PROJECTS, SKILLS } from "../constants";

const SYSTEM_PROMPT = `
你是一个服务于 ${PROFILE.name} 个人作品集网站的 AI 助手。
你的目标是仅基于以下提供的上下文回答关于 ${PROFILE.name} 的问题。
请保持专业、简洁且友好的语气。如果上下文中没有答案，请直接说你不知道，并建议直接联系 ${PROFILE.name}。

上下文信息:
姓名: ${PROFILE.name}
职位: ${PROFILE.role}
个人简介: ${PROFILE.bio}
地点: ${PROFILE.location}
邮箱: ${PROFILE.email}

技能: ${SKILLS.join(", ")}

工作经历:
${EXPERIENCE.map((e) => `- ${e.role} 在 ${e.company} (${e.period}): ${e.description}`).join("\n")}

项目:
${PROJECTS.map((p) => `- ${p.title}: ${p.description} (技术栈: ${p.tags.join(", ")})`).join("\n")}
`;

type HistoryMessage = { role: string; content: string };

type DeepSeekMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const toDeepSeekRole = (role: string): "user" | "assistant" => {
  if (role === "assistant" || role === "model") return "assistant";
  return "user";
};

export const sendMessageToDeepSeek = async (
  apiKey: string,
  message: string,
  history: HistoryMessage[] = []
) => {
  try {
    const messages: DeepSeekMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map((h) => ({
        role: toDeepSeekRole(h.role),
        content: h.content
      })),
      { role: "user", content: message }
    ];

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages,
        temperature: 0.6,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API Error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    return typeof text === "string" ? text.trim() : "";
  } catch (error) {
    console.error("DeepSeek API Error:", error);
    throw error;
  }
};
