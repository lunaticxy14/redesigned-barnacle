var LuckyNumber = {
    linkLomba: 'https://tebakangka.net/',

    init: function () {
        if (U.path() !== '/lobby') return;
        var self = this;
        setTimeout(function () {
            self.addGenerateButtons();
            self.createGeneratorModal();
            self.bindEvents();
            self.checkStorage();
        }, 1000);
    },

    addGenerateButtons: function () {
        var self = this;

        // Add to #togel4d game containers
        var togel4dContainers = U.qsa('#togel4d .game-lobby-content.game-container');
        for (var i = 0; i < togel4dContainers.length; i++) {
            var container = togel4dContainers[i];
            var title = container.querySelector('.game-title');
            var pasaran = title ? title.textContent.trim() : '';

            if (pasaran && !container.querySelector('.groupgeneratenumber')) {
                container.insertAdjacentHTML('beforeend',
                    '<div class="groupgeneratenumber" data-pasaran="' + pasaran + '">' +
                    '<span class="textgeneratenumber">Angka Hoki Kamu</span>' +
                    '<span class="tombolgeneratenumber">Generate</span>' +
                    '</div>' +
                    '<a href="' + U.getUrl('lomba-togel', self.linkLomba) + '"' + S.blank + ' class="button-ikuti-lomba" style="font-weight:600;display:flex;align-items:center;justify-content:center;gap:5px;margin-top:5px;">' +
                    'Ikuti Lomba <img src="' + C.img + 'OTHER/popular.gif" style="width:9px;">' +
                    '</a>'
                );
            }
        }

        // Add to pool containers
        var poolContainers = U.qsa('div.game-lobby-content > div.pool-container');
        for (var j = 0; j < poolContainers.length; j++) {
            var poolContainer = poolContainers[j];
            var poolTitle = poolContainer.querySelector('.game-title');
            var poolPasaran = poolTitle ? poolTitle.textContent.trim() : '';
            var parentContent = poolContainer.parentElement;

            if (poolPasaran && parentContent && parentContent.classList.contains('game-lobby-content') && !parentContent.querySelector('.groupgeneratenumber')) {
                parentContent.insertAdjacentHTML('beforeend',
                    '<div class="groupgeneratenumber" data-pasaran="' + poolPasaran + '">' +
                    '<span class="textgeneratenumber">Angka Hoki</span>' +
                    '<span class="tombolgeneratenumber">Generate</span>' +
                    '<a href="' + U.getUrl('lomba-togel', self.linkLomba) + '"' + S.blank + ' class="button-ikuti-lomba" style="font-weight:600;display:flex;align-items:center;justify-content:center;gap:5px;margin-top:5px;">' +
                    'Ikuti Lomba <img src="' + C.img + 'OTHER/popular.gif" style="width:9px;">' +
                    '</a>' +
                    '</div>'
                );
            }
        }
    },

    createGeneratorModal: function () {
        var gameTogelAll = U.qs('#game-togel-all');
        if (!gameTogelAll || U.qs('.groupfiturgenerator')) return;

        gameTogelAll.insertAdjacentHTML('afterend',
            '<div class="groupfiturgenerator">' +
            '<div class="contentfiturgenerator">' +
            '<span class="tombolclosegenerator">X</span>' +
            '<span class="titlefiturgenerator">Angka Hoki Hongkong</span>' +
            '<div class="groupnumberrandom">' +
            '<div class="listnumberbola" data-bola="9"></div>' +
            '<div class="listnumberbola" data-bola="9"></div>' +
            '<div class="listnumberbola" data-bola="9"></div>' +
            '<div class="listnumberbola" data-bola="9"></div>' +
            '<div class="listnumberbola" data-bola="9"></div>' +
            '</div>' +
            '<span class="spingenerate">Generate Number</span>' +
            '</div>' +
            '</div>'
        );
    },

    bindEvents: function () {
        var self = this;

        // Click on generate button
        d.addEventListener('click', function (e) {
            // Generate/Copy button
            if (e.target.classList.contains('tombolgeneratenumber')) {
                e.preventDefault();
                e.stopPropagation();
                var btn = e.target;
                var btnText = btn.textContent.trim();

                // If already showing a number, copy it
                if (/^\d+$/.test(btnText)) {
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(btnText).then(function () {
                            if (typeof Swal !== 'undefined') {
                                Swal.fire({ text: 'Nomor telah dicopy', icon: 'success', timer: 1500, showConfirmButton: false });
                            } else {
                                alert('Nomor telah dicopy: ' + btnText);
                            }
                        });
                    }
                    return;
                }

                // Show generator modal
                var parent = btn.closest('.groupgeneratenumber');
                var pasaran = parent ? parent.getAttribute('data-pasaran') : '';
                var modal = U.qs('.groupfiturgenerator');
                var titleEl = U.qs('.titlefiturgenerator');

                if (modal && titleEl) {
                    modal.classList.add('active');
                    titleEl.textContent = 'Angka Hoki ' + pasaran;

                    // Toggle 5th ball for 5D
                    var balls = U.qsa('.listnumberbola');
                    var isFiveDigit = pasaran.indexOf('5D') > -1;
                    if (balls[4]) balls[4].style.display = isFiveDigit ? 'flex' : 'none';

                    // Check storage for disabled state
                    var storageData = JSON.parse(localStorage.getItem('dataGenerateNumber') || '{}');
                    var spinBtn = U.qs('.spingenerate');
                    if (spinBtn) {
                        if (storageData[pasaran] && Date.now() < storageData[pasaran].expires) {
                            spinBtn.style.opacity = '0.5';
                            spinBtn.setAttribute('data-disabled', 'true');
                        } else {
                            spinBtn.style.opacity = '1';
                            spinBtn.removeAttribute('data-disabled');
                        }
                    }
                }
            }

            // Spin/Generate button
            if (e.target.classList.contains('spingenerate')) {
                if (e.target.getAttribute('data-disabled') === 'true') return;
                self.generateNumbers();
            }

            // Close button
            if (e.target.classList.contains('tombolclosegenerator')) {
                var modal = U.qs('.groupfiturgenerator');
                if (modal) modal.classList.remove('active');
            }

            // Click outside to close
            if (!e.target.closest('.contentfiturgenerator') && !e.target.closest('.tombolgeneratenumber')) {
                var modal = U.qs('.groupfiturgenerator');
                if (modal && modal.classList.contains('active')) {
                    modal.classList.remove('active');
                }
            }
        });
    },

    generateNumbers: function () {
        var titleEl = U.qs('.titlefiturgenerator');
        var pasaran = titleEl ? titleEl.textContent.replace('Angka Hoki ', '') : '';
        var isFiveDigit = pasaran.indexOf('5D') > -1;
        var totalDigits = isFiveDigit ? 5 : 4;
        var finalNumbers = [];
        var usedNumbers = {};
        var spinBtn = U.qs('.spingenerate');

        if (spinBtn) {
            spinBtn.style.opacity = '0.5';
            spinBtn.setAttribute('data-disabled', 'true');
        }

        // Generate unique random numbers
        while (finalNumbers.length < totalDigits) {
            var num = Math.floor(Math.random() * 10);
            if (!usedNumbers[num]) {
                usedNumbers[num] = true;
                finalNumbers.push(num);
            }
        }

        // Animate balls
        var balls = U.qsa('.listnumberbola');
        for (var i = 0; i < totalDigits; i++) {
            (function (index, finalNum) {
                var ball = balls[index];
                var count = 0;
                var interval = setInterval(function () {
                    var randomNum = Math.floor(Math.random() * 10);
                    ball.setAttribute('data-bola', randomNum);
                    count++;

                    if (count > 20) {
                        clearInterval(interval);
                        ball.setAttribute('data-bola', finalNum);

                        // On last ball, save to storage
                        if (index === totalDigits - 1) {
                            var result = finalNumbers.join('');
                            var storageData = JSON.parse(localStorage.getItem('dataGenerateNumber') || '{}');
                            storageData[pasaran] = {
                                number: result,
                                expires: Date.now() + (6 * 60 * 60 * 1000)
                            };
                            localStorage.setItem('dataGenerateNumber', JSON.stringify(storageData));

                            // Update button text
                            var generateBtn = U.qs('.groupgeneratenumber[data-pasaran="' + pasaran + '"] .tombolgeneratenumber');
                            if (generateBtn) {
                                generateBtn.textContent = result;
                                generateBtn.style.background = 'transparent';
                                generateBtn.style.border = '1px solid #faab22';
                            }
                        }
                    }
                }, 50);
            })(i, finalNumbers[i]);
        }
    },

    checkStorage: function () {
        var storageData = JSON.parse(localStorage.getItem('dataGenerateNumber') || '{}');
        var currentTime = Date.now();
        var isUpdated = false;

        for (var pasaran in storageData) {
            if (storageData.hasOwnProperty(pasaran)) {
                if (currentTime > storageData[pasaran].expires) {
                    delete storageData[pasaran];
                    isUpdated = true;
                } else {
                    var generateBtn = U.qs('.groupgeneratenumber[data-pasaran="' + pasaran + '"] .tombolgeneratenumber');
                    if (generateBtn) {
                        generateBtn.textContent = storageData[pasaran].number;
                        generateBtn.style.background = 'transparent';
                        generateBtn.style.border = '1px solid #faab22';
                    }
                }
            }
        }

        if (isUpdated) {
            localStorage.setItem('dataGenerateNumber', JSON.stringify(storageData));
        }
    }
};