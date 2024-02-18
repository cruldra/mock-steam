// https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream
function iteratorToStream(iterator: any) {
    return new ReadableStream({
        async pull(controller) {
            const { value, done } = await iterator.next()

            if (done) {
                controller.close()
            } else {
                controller.enqueue(value)
            }
        },
    })
}

function sleep(time: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    })
}

const encoder = new TextEncoder()

async function* makeIterator() {
    yield encoder.encode('One ')
    await sleep(3000)
    yield encoder.encode('Two ')
    await sleep(3000)
    yield encoder.encode('Three ')
}

export async function GET() {
    const iterator = makeIterator()
    const stream = iteratorToStream(iterator)

    return new Response(stream)
}
export const config = {
    supportsResponseStreaming: true,
};
