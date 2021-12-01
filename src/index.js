const { scheduleCron } = require('./utils/crontab')
const config = require('./app/config')

scheduleCron(config.RECURRENCE_RULE)
