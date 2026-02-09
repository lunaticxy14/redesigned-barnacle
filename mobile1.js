(function () {

    var LuckyNumber = {

        linkLomba: 'https://tebakangka.net/',

        init: function () {
            if (!location.pathname.includes('/lobby')) return;

            var self = this;

            // Tunggu DOM siap
            document.addEventListener('DOMContentLoaded', function () {
                self.addGenerateButtons();
                self.bindEvents();
            });
        },

        addGenerateButtons: function () {

            // Togel 4D
            var togelContainers = document.querySelectorAll(
                '#togel4d .game-lobby-content.game-container'
            );

            togelContainers.forEach(function (container) {

                if (container.querySelector('.groupgeneratenumber')) return;

                var title = container.querySelector('.game-title');
                if (!title) return;

                var pasaran = title.textContent.trim();

                container.insertAdjacentHTML('beforeend',
                    '<div class="groupgeneratenumber" data-pasaran="' + pasaran + '">' +
                        '<span class="textgeneratenumber">Angka Hoki Kamu</span>' +
                        '<span class="tombolgeneratenumber">Generate</span>' +
                    '</div>' +
                    '<a href="' + LuckyNumber.linkLomba + '" target="_blank" ' +
                        'class="button-ikuti-lomba" ' +
                        'style="font-weight:600;display:flex;align-items:center;' +
                        'justify-content:center;gap:5px;margin-top:5px;">' +
                        'Ikuti Lomba' +
                    '</a>'
                );
            });

            // Pool
            var poolContainers = document.querySelectorAll('.pool-container');

            poolContainers.forEach(function (pool) {

                var parent = pool.closest('.game-lobby-content');
                if (!parent || parent.querySelector('.groupgeneratenumber')) return;

                var title = pool.querySelector('.game-title');
                if (!title) return;

                var pasaran = title.textContent.trim();

                parent.insertAdjacentHTML('beforeend',
                    '<div class="groupgeneratenumber" data-pasaran="' + pasaran + '">' +
                        '<span class="textgeneratenumber">Angka Hoki</span>' +
                        '<span class="tombolgeneratenumber">Generate</span>' +
                    '</div>'
                );
            });
        },

        bindEvents: function () {

            document.addEventListener('click', function (e) {

                if (!e.target.classList.contains('tombolgeneratenumber')) return;

                e.preventDefault();

                var btn = e.target;
                var text = btn.textContent.trim();

                // Copy kalau sudah angka
                if (/^\d+$/.test(text)) {
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(text);
                    }
                    return;
                }

                // Generate 4 digit unik
                var result = '';
                var used = {};

                while (result.length < 4) {
                    var n = Math.floor(Math.random() * 10);
                    if (!used[n]) {
                        used[n] = true;
                        result += n;
                    }
                }

                btn.textContent = result;
                btn.style.background = 'transparent';
                btn.style.border = '1px solid #faab22';
            });
        }
    };

    // AUTO INIT
    LuckyNumber.init();

})();
