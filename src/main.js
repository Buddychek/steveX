const { loadConfig } = require('./utils/config')
const { AgentManager } = require('./agent/agent_manager')
const { startWebServer } = require('./web/server')

const manager = new AgentManager(loadConfig)

// Auto-connect all configured agents and attach brains (JeVBot addition)
for (const [name, cfg] of manager.agentConfigs) {
  if (manager.connectAgent(name) && cfg?.brain?.enabled) {
    const agent = manager.agents.get(name)
    if (agent) agent.startBrain(cfg.brain, manager.eventBus)
  }
}

console.log('[info][main] Starting SteveX with config:', manager.config)

startWebServer(manager)

process.on('SIGINT', () => {
  console.log('[info][main] Shutting down')
  manager.disconnectAll()
  process.exit(0)
})
