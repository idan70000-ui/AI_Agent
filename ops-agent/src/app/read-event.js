import React from 'react'
export async function readEvent( response, onEvent) {
  if (!response.body) {
    onEvent({ type: "error", message: `server response http status: ${response.status}` });
    return;
  }
 
const reader = response.body.getReader();
const decoder = new TextDecoder();

let buffer = "";

while (true) {
    const { value, done } = await reader.read();
    if (done) break;


    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (const line of lines) {
        if (line.trim()) onEvent(JSON.parse(line));
   }
 }
}

// קריאה של האיוונטים