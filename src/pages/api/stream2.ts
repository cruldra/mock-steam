import {NextApiRequest, NextApiResponse} from 'next';
import {Readable} from 'stream'; // 引入 Readable 流

// 假设 service.chat() 返回一个事件发射器，它会发射 'content' 事件
// 在真实应用中，你需要根据你的 service 实际情况来实现这个部分
// 假设 service.chat() 返回一个 Readable 流
const service = {
    chat: (user:any, body:any) => {
        const contentStream = new Readable({
            read(size) {
                // 这里应该是产生数据的逻辑，这个例子中我们使用 setTimeout 来模拟异步数据的到来
                setTimeout(() => this.push('Hello, '), 1000);
                setTimeout(() => this.push('this is '), 2000);
                setTimeout(() => this.push('a streaming '), 3000);
                setTimeout(() => {
                    this.push('response.');
                    this.push(null); // 结束流
                }, 4000);
            }
        });

        return contentStream;
    },
};
export const config = {
    supportsResponseStreaming: true,
};
export default (req: NextApiRequest, res: NextApiResponse) => {
    // 假设 user 和 body 通过某种方式从 req 中获取
    const user = {}; // 获取用户信息
    const body = {}; // 获取请求体

    // 设置 HTTP 响应头
    /*res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });*/

    // Example: Emit data every second
    const intervalId = setInterval(() => {
        res.write(`data: ${new Date().toISOString()}\n\n`);

        // Flush the data immediately to the client.
        // Not all servers support this. If you’re using Node.js without a proxy, it should work.
        if (res.flushHeaders) {
            res.flushHeaders();
        }
    }, 1000);

    // When the client closes the connection, stop the interval.
    req.on('close', () => {
        clearInterval(intervalId);
    });
    /*const contentStream = service.chat(user, body);

    // 将 Readable 流连接到响应对象
    contentStream.pipe(res);

    contentStream.on('end', () => {
        res.end();
    });

    // 处理错误情况
    contentStream.on('error', (err) => {
        console.error(err);
        res.statusCode = 500;
        res.end(`Error: ${err.message}`);
    });*/
};
