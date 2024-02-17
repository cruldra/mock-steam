// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export const GET = async (req: Request) => {
  const encoder = new TextEncoder();
  const message = "你好，有什么我可以帮助你的。";
  const delay = 3000; // 3秒
  const chunkDelay = delay / message.length;

  let messageIndex = 0;

  const stream = new ReadableStream({
    start(controller) {
      const interval = setInterval(() => {
        // 如果消息已经发送完毕，关闭流并清除定时器
        if (messageIndex >= message.length) {
          clearInterval(interval);
          controller.close();
          return;
        }

        // 发送消息的下一个字符
        controller.enqueue(encoder.encode(message[messageIndex]));
        messageIndex++;
      }, chunkDelay);
    }
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain' }
  });
};
