import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.getElementById('search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.getElementById('load-more-btn');
const endMessage = document.getElementById('end-message');

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;
const PER_PAGE = 15;

// пошук
form.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(form);
  const query = formData.get('search-text').trim();

  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query.',
      position: 'topRight',
    });
    return;
  }

  // скидаємо попередні результати
  currentQuery = query;
  currentPage = 1;
  totalHits = 0;
  clearGallery();
  hideLoadMore();
  hideEndMessage();

  await fetchAndRender();
});

// підвантаження наступної сторінки
loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  await fetchAndRender(true);
});

// універсальна функція завантаження
async function fetchAndRender(isLoadMore = false) {
  showLoader();
  try {
    const { hits, totalHits: total } = await getImagesByQuery(
      currentQuery,
      currentPage,
      PER_PAGE
    );

    if (hits.length === 0 && !isLoadMore) {
      iziToast.info({
        title: 'No results',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    createGallery(hits);

    if (!isLoadMore) {
      iziToast.success({
        title: 'Success',
        message: `Found ${total} images. Showing ${hits.length}.`,
        position: 'topRight',
      });
    }

    totalHits = total;
    const loadedImages = currentPage * PER_PAGE;

    if (loadedImages < totalHits) {
      showLoadMore();
    } else {
      hideLoadMore();
      showEndMessage();
    }

    // плавний скрол тільки при load more
    if (isLoadMore) {
      const { height } = galleryEl.firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: height * 2,
        behavior: 'smooth',
      });
    }
  } catch (err) {
    console.error(err);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong while fetching images.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

// допоміжні
function showLoadMore() {
  loadMoreBtn.classList.remove('is-hidden');
}
function hideLoadMore() {
  loadMoreBtn.classList.add('is-hidden');
}
function showEndMessage() {
  endMessage.classList.remove('is-hidden');
}
function hideEndMessage() {
  endMessage.classList.add('is-hidden');
}
