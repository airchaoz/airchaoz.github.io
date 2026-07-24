/* ============================================================
 *  TOC Auto-Scroll
 *  - Listens to Icarus's existing is-active class mutations
 *  - Auto-scrolls the TOC's internal list to keep the active
 *    item visible when the page scrolls to a new section
 *  - Suspended while user is hovering the TOC
 *  - Uses scrollIntoView({ block: 'nearest' }) for natural behavior
 *  - PJAX compatible
 * ============================================================ */
(function () {
    'use strict';

    var supportsObserver = typeof window.MutationObserver === 'function';
    var supportsHover = typeof document.querySelector === 'function';

    function autoScrollActiveItem($toc) {
        if (!supportsHover) {
            return;
        }
        if ($toc.matches(':hover')) {
            return;
        }
        var $active = $toc.querySelector('.menu-list a.is-active');
        if (!$active) {
            return;
        }
        try {
            $active.scrollIntoView({ block: 'nearest' });
        } catch (e) {
            // Old browser without options object
            try { $active.scrollIntoView(); } catch (e2) { /* noop */ }
        }
    }

    function init() {
        if (!supportsObserver) {
            return;
        }
        var $toc = document.getElementById('toc');
        if (!$toc) {
            return;
        }
        if ($toc.dataset.tocAutoscrollBound === '1') {
            return;
        }
        $toc.dataset.tocAutoscrollBound = '1';

        var observer = new MutationObserver(function () {
            autoScrollActiveItem($toc);
        });
        observer.observe($toc, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }

    function bootstrap() {
        init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }

    // PJAX: re-bind on page swap. Use a small delay to let Icarus's toc.js
    // finish its own setup before our observer starts watching.
    if (typeof window !== 'undefined') {
        window.addEventListener('pjax:complete', function () {
            setTimeout(init, 0);
        });
    }
})();
