# Worker produces updates, gateway and broker fan out

Simulation workers produce tagged run updates for live subscriptions and trace persistence. The gateway and event broker handle routing and fanout to subscribed clients, keeping the worker focused on deterministic simulation instead of browser subscription management. A separate stream projection service can be introduced later if fanout or query load outgrows the gateway/broker path.
