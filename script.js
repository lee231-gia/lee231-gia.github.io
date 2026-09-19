// Lyzel Mae Talisic Portfolio
// Simple Vanilla JavaScript only.

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// -------------------------
// NAVIGATION
// -------------------------
const menuToggle = $('.menu-toggle');
const navLinks = $('.nav-links');
const pageActiveNav = $('.nav-links .active');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show-menu');
    });

    navLinks.addEventListener('click', (event) => {
        if (event.target.closest('a')) {
            navLinks.classList.remove('show-menu');
        }
    });
}

function previewDropdownActive(button) {
    $$('.nav-links > li > a, .nav-links > li > .dropdown-btn').forEach((item) => {
        item.classList.remove('active');
    });
    button.classList.add('active');
}

function restorePageActive() {
    $$('.nav-links > li > a, .nav-links > li > .dropdown-btn').forEach((item) => {
        item.classList.remove('active');
    });
    if (pageActiveNav) pageActiveNav.classList.add('active');
}

function closeOtherDropdowns(currentMenu) {
    $$('.dropdown-menu.show').forEach((menu) => {
        if (menu !== currentMenu) menu.classList.remove('show');
    });

    $$('.dropdown-btn').forEach((button) => {
        const arrow = button.querySelector('span');
        if (arrow && !button.nextElementSibling?.classList.contains('show')) {
            arrow.textContent = '↓';
        }
    });
}

function setupDropdown(buttonSelector, menuSelector, arrowSelector) {
    const button = $(buttonSelector);
    const menu = $(menuSelector);
    const arrow = $(arrowSelector);

    if (!button || !menu) return;

    button.addEventListener('click', (event) => {
        event.stopPropagation();
        const wasOpen = menu.classList.contains('show');

        closeOtherDropdowns(menu);
        menu.classList.toggle('show', !wasOpen);

        if (arrow) arrow.textContent = wasOpen ? '↓' : '↑';
        if (wasOpen) restorePageActive();
        else previewDropdownActive(button);
    });

    window.addEventListener('click', (event) => {
        if (!button.contains(event.target) && !menu.contains(event.target)) {
            const wasOpen = menu.classList.contains('show');
            menu.classList.remove('show');
            if (arrow) arrow.textContent = '↓';
            if (wasOpen) restorePageActive();
        }
    });
}

setupDropdown('#dropdownBtn', '#dropdownMenu', '.dropdown-arrow');
setupDropdown('#contactDropdownBtn', '#contactDropdownMenu', '.contact-dropdown-arrow');

// -------------------------
// OPENING COVER
// -------------------------
const openPortfolio = $('#openPortfolio');

if (openPortfolio) {
    openPortfolio.addEventListener('click', () => {
        document.body.classList.add('is-opening');
        setTimeout(() => window.location.href = 'home.html', 680);
    });
}

// -------------------------
// WORK ARCHIVE
// -------------------------
const archiveDrawer = $('#archiveDrawer');
const archiveBackdrop = $('#archiveBackdrop');
const archiveDrawerFull = $('#archiveDrawerFull');
const archiveTabs = $$('.archive-file-tab');
const archiveFiles = $$('.archive-file');

function openArchive(projectId) {
    if (!archiveDrawer) return;

    const selected = [...archiveFiles].find((file) => file.dataset.project === projectId);
    if (!selected) return;

    archiveFiles.forEach((file) => file.classList.toggle('active', file === selected));
    archiveTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.file === projectId));

    archiveDrawer.classList.add('drawer-open');
    archiveDrawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('archive-open');

    if (archiveBackdrop) {
        archiveBackdrop.classList.add('show');
        archiveBackdrop.setAttribute('aria-hidden', 'false');
    }
}

function closeArchive(clearHash = true) {
    if (!archiveDrawer) return;

    archiveDrawer.classList.remove('drawer-open', 'drawer-full');
    archiveDrawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('archive-open');
    archiveTabs.forEach((tab) => tab.classList.remove('active'));

    if (archiveDrawerFull) archiveDrawerFull.textContent = 'full view ↗';
    if (archiveBackdrop) {
        archiveBackdrop.classList.remove('show');
        archiveBackdrop.setAttribute('aria-hidden', 'true');
    }

    if (clearHash && window.location.hash) {
        history.replaceState(null, '', window.location.pathname);
    }
}

function openArchiveFromHash() {
    if (!archiveDrawer) return;
    const projectId = window.location.hash.slice(1);
    projectId ? openArchive(projectId) : closeArchive(false);
}

archiveTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        const id = tab.dataset.file;
        window.location.hash === `#${id}` ? openArchive(id) : window.location.hash = id;
    });
});

$$('.dropdown-menu a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
        if (!archiveDrawer) return;
        event.preventDefault();
        const id = link.getAttribute('href').slice(1);
        window.location.hash === `#${id}` ? openArchive(id) : window.location.hash = id;
    });
});

if (archiveDrawerFull && archiveDrawer) {
    archiveDrawerFull.addEventListener('click', () => {
        archiveDrawer.classList.toggle('drawer-full');
        archiveDrawerFull.textContent = archiveDrawer.classList.contains('drawer-full')
            ? 'side view ↙'
            : 'full view ↗';
    });
}

$('#archiveDrawerClose')?.addEventListener('click', () => closeArchive());
archiveBackdrop?.addEventListener('click', () => closeArchive());
window.addEventListener('hashchange', openArchiveFromHash);
openArchiveFromHash();

// -------------------------
// HIDDEN MUSIC PLAYER
// -------------------------
const musicTrigger = $('#musicTrigger');
const musicSecret = $('#musicSecret');
const musicPlayer = $('#musicPlayer');
const musicPlayPause = $('#musicPlayPause');
const musicStatus = $('#musicStatus');

function updateMusicButton() {
    if (musicPlayPause && musicPlayer) {
        musicPlayPause.textContent = musicPlayer.paused ? 'play' : 'pause';
    }
}

function playMusic() {
    if (!musicPlayer) return;

    musicPlayer.play()
        .then(() => {
            if (musicStatus) musicStatus.textContent = 'playing';
            updateMusicButton();
        })
        .catch(() => {
            if (musicStatus) musicStatus.textContent = 'track unavailable';
        });
}

musicTrigger?.addEventListener('click', () => {
    if (!musicSecret) return;
    musicSecret.classList.toggle('show');

    if (musicSecret.classList.contains('show')) playMusic();
    else {
        musicPlayer?.pause();
        updateMusicButton();
    }
});

musicPlayPause?.addEventListener('click', () => {
    if (!musicPlayer) return;

    if (musicPlayer.paused) playMusic();
    else {
        musicPlayer.pause();
        if (musicStatus) musicStatus.textContent = 'paused';
        updateMusicButton();
    }
});

$('#musicClose')?.addEventListener('click', () => {
    musicSecret?.classList.remove('show');
    musicPlayer?.pause();
    updateMusicButton();
});

musicPlayer?.addEventListener('ended', () => {
    if (musicStatus) musicStatus.textContent = 'finished';
    updateMusicButton();
});

// -------------------------
// IMAGE DIALOGS
// -------------------------
function setupImageDialog(options) {
    const dialog = $(options.dialog);
    const image = $(options.image);
    const title = $(options.title);

    if (!dialog || !image) return;

    $$(options.buttons).forEach((button) => {
        button.addEventListener('click', () => {
            image.src = button.dataset[options.imageData];
            image.alt = button.dataset[options.titleData] || options.fallback;
            if (title) title.textContent = image.alt;
            dialog.showModal();
        });
    });

    $(options.close)?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
    });
}

const workPreviewDialog = $('#workPreviewDialog');
const workPreviewImage = $('#workPreviewImage');
const workPreviewTitle = $('#workPreviewTitle');

$$('[data-full-preview]').forEach((button) => {
    button.addEventListener('click', () => {
        if (!workPreviewDialog || !workPreviewImage) return;
        workPreviewImage.src = button.dataset.fullPreview;
        workPreviewImage.alt = button.dataset.previewTitle || 'Work preview';
        if (workPreviewTitle) workPreviewTitle.textContent = workPreviewImage.alt;
        workPreviewDialog.showModal();
    });
});

$('#workPreviewClose')?.addEventListener('click', () => workPreviewDialog?.close());
workPreviewDialog?.addEventListener('click', (event) => {
    if (event.target === workPreviewDialog) workPreviewDialog.close();
});

setupImageDialog({
    buttons: '[data-certificate]',
    dialog: '#certificateDialog',
    image: '#certificateDialogImage',
    title: '#certificateDialogTitle',
    close: '#certificateDialogClose',
    imageData: 'certificate',
    titleData: 'title',
    fallback: 'Certificate'
});

// -------------------------
// CONTACT COPY BUTTONS
// -------------------------
const copyToast = $('#copyToast');

function showCopyToast(message) {
    if (!copyToast) return;

    copyToast.textContent = message;
    copyToast.classList.add('show');
    setTimeout(() => copyToast.classList.remove('show'), 1600);
}

$$('[data-copy]').forEach((button) => {
    button.addEventListener('click', () => {
        const value = button.dataset.copy;
        if (!value) return;

        navigator.clipboard.writeText(value)
            .then(() => showCopyToast(`Copied: ${value}`))
            .catch(() => showCopyToast('Copy failed. Select the text manually.'));
    });
});

// Escape closes the archive drawer.
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && archiveDrawer?.classList.contains('drawer-open')) {
        closeArchive();
    }
});
