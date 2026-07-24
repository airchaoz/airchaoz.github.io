/* ============================================================
 *  Theme Toggle
 *  - Inserts a sun/moon icon button into the navbar
 *  - On click: swap data-theme + persist to localStorage
 *  - Listens to OS preference changes (only if user hasn't chosen)
 *  - Vanilla JS, no jQuery dependency
 * ============================================================ */
(function () {
    'use strict';

    var STORAGE_KEY = 'theme';
    var DARK = 'dark';
    var LIGHT = 'light';

    function getStoredTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function setStoredTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            // localStorage unavailable - silently fail
        }
    }

    function getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return DARK;
        }
        return LIGHT;
    }

    function getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || LIGHT;
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    function createToggleButton() {
        var a = document.createElement('a');
        a.className = 'navbar-item theme-toggle';
        a.href = 'javascript:void(0);';
        a.title = '切换主题';
        a.setAttribute('aria-label', '切换主题');
        a.setAttribute('role', 'button');
        a.innerHTML = '<i class="fas fa-moon"></i><i class="fas fa-sun"></i>';
        return a;
    }

    function insertToggle() {
        var navbarEnds = document.querySelectorAll('.navbar-main .navbar-end');
        if (navbarEnds.length === 0) {
            return false;
        }
        for (var i = 0; i < navbarEnds.length; i++) {
            var end = navbarEnds[i];
            if (end.querySelector('.theme-toggle')) {
                return true;
            }
            end.appendChild(createToggleButton());
        }
        return true;
    }

    function handleToggleClick(e) {
        var target = e.target;
        while (target && target !== document.body) {
            if (target.classList && target.classList.contains('theme-toggle')) {
                var current = getCurrentTheme();
                var next = current === DARK ? LIGHT : DARK;
                applyTheme(next);
                setStoredTheme(next);
                return;
            }
            target = target.parentNode;
        }
    }

    function init() {
        if (!insertToggle()) {
            return;
        }
        document.addEventListener('click', handleToggleClick);

        // Listen for system theme changes; only react if user hasn't chosen
        if (window.matchMedia) {
            var mq = window.matchMedia('(prefers-color-scheme: dark)');
            var listener = function (event) {
                if (getStoredTheme() === null) {
                    applyTheme(event.matches ? DARK : LIGHT);
                }
            };
            if (mq.addEventListener) {
                mq.addEventListener('change', listener);
            } else if (mq.addListener) {
                // Safari < 14
                mq.addListener(listener);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // PJAX support: Icarus uses PJAX; re-inject button on page swap
    if (typeof window !== 'undefined') {
        window.addEventListener('pjax:complete', function () {
            insertToggle();
        });
    }
})();
