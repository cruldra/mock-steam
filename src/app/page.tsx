"use client"
import Image from "next/image";
import styles from "./page.module.css";
import axios from "axios";
import {useEffect, useState} from "react";
import {fetchAdapter, MixResponse} from "@dongjak-extensions/http-client";
// import fetchAdapter, {MixResponse} from "@/axios";
// import fetchAdapter from "@shiroyasha9/axios-fetch-adapter";
// import fetchAdapter from "@liuqiang1357/axios-fetch-adapter";
export default function Home() {
    const [dataByAxios, setDataByAxios] = useState('dataByAxios: ')
    const [dataByFetch, setDataByFetch] = useState('dataByFetch: ')
    const byAxios = () => {
        //废了,到现在还不支持 https://github.com/axios/axios/issues/479
        // https://github.com/axios/axios/issues/1474#issuecomment-578406887

        axios({
            method: 'get',
            url: '/api/stream4',
            responseType: 'stream',
            adapter:fetchAdapter,
        })
            .then(response => {
              const  res =   response  as any as MixResponse
                // console.log(res.data)
                /*console.log(response.data.pipe)*/
// setData(response.data)
                /*  response.data.on('data', (chunk: string) => {
                      // 处理流数据的逻辑
  setData(chunk)
                  });

                  response.data.on('end', () => {
                      // 数据接收完成的逻辑
                  });*/
                const reader = res.body ?.getReader();

                // 读取流中的数据
                let decoder = new TextDecoder(); // 用于将流中的字节解码成字符串
                reader?.read().then(function processText({done, value}): any {
                    if (done) {
                        // 流已经结束
                        console.log('Stream complete');
                        return;
                    }

                    // 将 Uint8Array 缓冲区转换为文本
                    let str = decoder.decode(value, {stream: true});
                    console.log(str);
                    setDataByAxios((prevDataByFetch) => prevDataByFetch + str)
                    // 读取下一个数据块
                    return reader.read().then(processText);
                });

            });
    }

    const byFetch = () => {
        // 假设你的流式 API 端点是 "/api/stream"
        fetch('/api/stream4')
            .then(response => {
                // response.body 是一个 ReadableStream
                const reader = response.body!!.getReader();

                // 读取流中的数据
                let decoder = new TextDecoder(); // 用于将流中的字节解码成字符串
                reader.read().then(function processText({done, value}):any {
                    if (done) {
                        // 流已经结束
                        console.log('Stream complete');
                        return;
                    }

                    // 将 Uint8Array 缓冲区转换为文本
                    let str = decoder.decode(value, {stream: true});
                    console.log(str);
                    setDataByFetch((prevDataByFetch) => prevDataByFetch + str)
                    // 读取下一个数据块
                    return reader.read().then(processText);
                });
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    }
    return (
        <div style={{display: "flex",flexDirection:"column",rowGap:"20px", justifyContent: "center", alignItems: "center" , height:"500px"}}>
            <p>
                <button onClick={byAxios}>使用axios</button>
                {dataByAxios}
            </p>
            <p>
                <button onClick={byFetch}>使用fetch</button>
                {dataByFetch}
            </p>
        </div>
    );
}
