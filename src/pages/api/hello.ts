import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    const message = "你好，有什么我可以帮助你的。";
    const totalDelay = 3000; // 总共3秒
    const stepDelay = totalDelay / message.length; // 每个字符的间隔时间

    let messageIndex = 0;

    // 发送消息的定时器
    const sendMessagePart = () => {
        // 如果消息没有发送完，写入下一个字符
        if (messageIndex < message.length) {
            res.write(message[messageIndex]);
            messageIndex++;
            // 继续设置定时器
            setTimeout(sendMessagePart, stepDelay);
        } else {
            // 消息发送完毕
            res.end();
        }
    };

    // 初始调用来开始发送消息
    sendMessagePart();
};
