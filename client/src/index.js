import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/main.scss';
import App from './App.js'
import reportWebVitals from './reportWebVitals';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { CaptureConsole as CaptureConsoleIntegration } from "@sentry/integrations";

Sentry.init({
  dsn: "https://160bf0b2a24a4221ae61cba3a3ea2884@o1140146.ingest.sentry.io/6197077",
  integrations: [
    new BrowserTracing(),     
    new CaptureConsoleIntegration({
    levels: ['error']
    })
  ],
  
  environment: process.env.NODE_ENV,
  
  //Later, if needed save calls to Sentry by turning it off in development
  //enabled: process.env.NODE_ENV !== 'development',

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
