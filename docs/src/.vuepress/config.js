var request = require('request');

const {spawnSync} = require('child_process');

const {description, pagetitle} = require('../../package')
const fs = require('fs');


async function getSideBar() {
    sidebar={}
    if(process.env.sidebar="true") {
        let rawdata = fs.readFileSync('./src/sidebar.json');
        idebar = JSON.parse(rawdata);
    }

    return sidebar;
}

module.exports = (async function () {
    return {
        /**
         * Ref：https://v1.vuepress.vuejs.org/config/#title
         */
        title: pagetitle,
        /**
         * Ref：https://v1.vuepress.vuejs.org/config/#description
         */
        description: description,

        /**
         * Extra tags to be injected to the page HTML `<head>`
         *
         * ref：https://v1.vuepress.vuejs.org/config/#head
         */
        head: [
            ['link', {rel: 'icon', href: `/logo.png`}],
            ['link', {rel: 'manifest', href: '/manifest.json'}],
            ['meta', {name: 'theme-color', content: '#3eaf7c'}],
            ['meta', {name: 'apple-mobile-web-app-capable', content: 'yes'}],
            ['meta', {name: 'apple-mobile-web-app-status-bar-style', content: 'black'}],
            ['link', {rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png`}],
            ['link', {rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c'}],
            ['meta', {name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png'}],
            ['meta', {name: 'msapplicatioFn-TileColor', content: '#000000'}]
        ],

        /**
         * Theme configuration, here is the default theme configuration for VuePress.
         *
         * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
         */


        themeConfig: {
            sidebarDepth: 5,
            lastUpdated: 'Last Updated', // string | boolean
            smoothScroll: true,
            activeHeaderLinks: false, // Default: true

            logo: '/idneo-logo.png',
            nav: [
                {text: 'Home', link: '/'},
                {text: 'Guide', link: '/guide/'},
                {text: 'External', link: 'https://google.com'}
            ],
            sidebar: await getSideBar()


        },

        /**
         * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
         */
        plugins: [
            ['@vuepress/back-to-top', true],
            ['@vuepress/pwa', {
                serviceWorker: true,
                updatePopup: true
            }],
            ['@vuepress/medium-zoom', true],
            ['@snowdog/vuepress-plugin-pdf-export', {
                puppeteerLaunchOptions: {
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                },
                pageOptions: {
                    displayHeaderFooter: true,
                }
            }]
        ]
    }
})

