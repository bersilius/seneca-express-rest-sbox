'use strict'

const plugin = 'monitoring'

module.exports = function(options) {
    const seneca = this
    
    seneca.add(`init:${plugin}`, function(msg, done) {
        done(null)
    })

    seneca.add(`role:${plugin},cmd:isAlive`, function(msg, done) {
        done(null, {
            response: true
        })
    })

    return plugin
}
