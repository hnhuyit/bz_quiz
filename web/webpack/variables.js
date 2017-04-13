module.exports = {
    target: 'web',
    ProvidePlugin: {
        $: "jquery",
        jQuery: "jquery",
        "windows.jQuery": "jquery",
        Tether: 'tether',
        io: 'socket.io-client',
    }
}
