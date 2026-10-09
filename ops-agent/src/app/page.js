"use client";


import React from 'react'
import { useState } from 'react';
import { readEvent } from './read-event';
export default function HomePage() {
  const [running, setRunning] = useState(false);
  const [events, setEvents] = useState([]);
  const [report, setReport] = useState('');
  const [error, setError] = useState('');

  console.log(running);
  console.log(events);
  console.log(report);
  console.log(error);

  async function investigate() {
    setRunning(true);
    setEvents([]);
    setReport('');
    setError('');

    try {
      const response = await fetch("/api/investigasion", {method: "POST"});
      await readEvent(response, (event) => { if (event.type === "report") { setReport(event.report); } 
      else if (event.type === "error") { setError(event.message); }
      else { setEvents((prev) => [...prev, event]); } });
 
      
    } catch (error) {
      setError(error.message);
    } finally {
      setRunning(false);
    }
  }
      // יש לי אירוע 1
      // יש לי עוד אירוע 2
    
     
  
  return (
    <main>
      <h1 className="text-7xl font-bold">DevOps Agent</h1>
      <p className="text-2xl font-semibold">
        AI Agent for investigating bugs!!
      </p>
      <button onClick={investigate} disabled={running} >{running ? "Investigating..." : "Investigate the service"}</button> 
      <h2>what the agent is doing?</h2>

      {events.map((event, i) => (
        <div key={i}>{event.type === "tool_called" ? `${event.tool} tool started ✨` : `${event.tool} tool returned 😎`}
      
      {event.output && <pre>{JSON.stringify(event.output, null, 2)}</pre>}
      </div>
      ))}
      <h2>Report 📄📄</h2>
      {error && <p>{error}</p>}
      <p>{report}</p>
    </main>
  );
}
