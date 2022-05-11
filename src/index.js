/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
import './styles.css';

const $ = require('jquery');

// Start with creating container
const containerCreation = document.createElement('div');
containerCreation.classList.add('container');
document.body.appendChild(containerCreation);

// Functionality for dynamically loading profiles
function getParameterByName(name, url = window.location.href) {
  const newName = name.replace(/[[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${newName}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

let activeUser = getParameterByName('user');
// Check case in case no user is specified in URL
if (activeUser === null) { activeUser = 'user2'; }

// Encapsulated user objects that were given in another object
const users = {
  user1: {
    userName: '@elonmusk',
    displayName: 'Elon Musk',
    joinedDate: 'June 2009',
    followingCount: 103,
    followerCount: 47900000,
    avatarURL: 'elonmusk.jpg',
    coverPhotoURL: 'elonmusk-cover.jpeg',
    tweets: [
      {
        text: 'I admit to judging books by their cover',
        timestamp: '2/10/2021 00:01:20',
      },
      {
        text: 'Starship to the moon',
        timestamp: '2/09/2021 18:37:12',
      },
      {
        text: 'Out on launch pad, engine swap underway',
        timestamp: '2/09/2021 12:11:51',
      },
    ],
  },
  user2: {
    userName: '@BillGates',
    displayName: 'Bill Gates',
    joinedDate: 'June 2009',
    followingCount: 274,
    followerCount: 53800000,
    avatarURL: 'billgates.jpg',
    coverPhotoURL: 'billgates-cover.jpeg',
    tweets: [
      {
        text: 'Everybody asks, how is the next Windows coming along? But nobody asks how is Bill? :/',
        timestamp: '2/10/2021 00:01:20',
      },
      {
        text: 'Should I start tweeting memes? Let me know in a comment.',
        timestamp: '2/09/2021 18:37:12',
      },
      {
        text: 'In 2020, I read a book every hour.',
        timestamp: '2/09/2021 12:11:51',
      },
    ],
  },
};

// Functionality for image loading with webpack
function importAll(r) {
  const images = {};
  // eslint-disable-next-line array-callback-return
  r.keys().map((item) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('../assets', false, /\.(png|jpe?g|svg)$/));

const container = $('.container');
// function to calulcate the amount of followers to get the proper formatting
function calculateFollowing(following) {
  if (following > 999 && following < 999999) {
    const temp = following / 1000;
    const tempFixed = temp.toFixed(1);
    return `${tempFixed}k`;
  }
  if (following > 999999 && following < 999999999) {
    const temp = following / 1000000;
    const tempFixed = temp.toFixed(1);
    return `${tempFixed}m`;
  }
  if (following > 999999999) {
    const temp = following / 1000000000;
    const tempFixed = temp.toFixed(1);
    return `${tempFixed}m`;
  }
  return following;
}

// Function to populate the tweets with user information
function populateTweets(parentElement, usr) {
  for (const tweet of usr.tweets) {
    const temp = document.createElement('div');
    temp.innerHTML = `
    <div class="tweet">
    <div class="tweet-profile">
        <img src="${images[usr.avatarURL]}" alt="${usr.displayName} profile picture" class="tweet-profile-img">
    </div>
    <div class="tweet-user-info">
        <h5>${usr.displayName}
            <span class="verified">
                <svg height="15" viewBox="0 0 500 500" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="m512 268c0 17.9-4.3 34.5-12.9 49.7s-20.1 27.1-34.6 35.4c.4 2.7.6 6.9.6 12.6 0 27.1-9.1 50.1-27.1 69.1-18.1 19.1-39.9 28.6-65.4 28.6-11.4 0-22.3-2.1-32.6-6.3-8 16.4-19.5 29.6-34.6 39.7-15 10.2-31.5 15.2-49.4 15.2-18.3 0-34.9-4.9-49.7-14.9-14.9-9.9-26.3-23.2-34.3-40-10.3 4.2-21.1 6.3-32.6 6.3-25.5 0-47.4-9.5-65.7-28.6-18.3-19-27.4-42.1-27.4-69.1 0-3 .4-7.2 1.1-12.6-14.5-8.4-26-20.2-34.6-35.4-8.5-15.2-12.8-31.8-12.8-49.7 0-19 4.8-36.5 14.3-52.3s22.3-27.5 38.3-35.1c-4.2-11.4-6.3-22.9-6.3-34.3 0-27 9.1-50.1 27.4-69.1s40.2-28.6 65.7-28.6c11.4 0 22.3 2.1 32.6 6.3 8-16.4 19.5-29.6 34.6-39.7 15-10.1 31.5-15.2 49.4-15.2s34.4 5.1 49.4 15.1c15 10.1 26.6 23.3 34.6 39.7 10.3-4.2 21.1-6.3 32.6-6.3 25.5 0 47.3 9.5 65.4 28.6s27.1 42.1 27.1 69.1c0 12.6-1.9 24-5.7 34.3 16 7.6 28.8 19.3 38.3 35.1 9.5 15.9 14.3 33.4 14.3 52.4zm-266.9 77.1 105.7-158.3c2.7-4.2 3.5-8.8 2.6-13.7-1-4.9-3.5-8.8-7.7-11.4-4.2-2.7-8.8-3.6-13.7-2.9-5 .8-9 3.2-12 7.4l-93.1 140-42.9-42.8c-3.8-3.8-8.2-5.6-13.1-5.4-5 .2-9.3 2-13.1 5.4-3.4 3.4-5.1 7.7-5.1 12.9 0 5.1 1.7 9.4 5.1 12.9l58.9 58.9 2.9 2.3c3.4 2.3 6.9 3.4 10.3 3.4 6.7-.1 11.8-2.9 15.2-8.7z"
                        fill="#1da1f2" /></svg>
            </span>
            <span class="tweet-username">${usr.userName}</span>
            <span class="tweet-date">${tweet.timestamp}}</span>
        </h5>
        <p class="tweet-text">
            ${tweet.text};
        </p>
    </div>
</div>
    `;
    document.querySelector(parentElement).append(temp);
  }
}

// Dynamic rendering of DOM elements based on user data
container.html(`
<div class="header">
<div class="return-logo">
    <a href="#">🡨</a>
</div>
<h2 class="name">
    ${users[activeUser].displayName}
    <span class="verified">
        <svg height="25" viewBox="0 0 500 500" width="30" xmlns="http://www.w3.org/2000/svg">
            <path
                d="m512 268c0 17.9-4.3 34.5-12.9 49.7s-20.1 27.1-34.6 35.4c.4 2.7.6 6.9.6 12.6 0 27.1-9.1 50.1-27.1 69.1-18.1 19.1-39.9 28.6-65.4 28.6-11.4 0-22.3-2.1-32.6-6.3-8 16.4-19.5 29.6-34.6 39.7-15 10.2-31.5 15.2-49.4 15.2-18.3 0-34.9-4.9-49.7-14.9-14.9-9.9-26.3-23.2-34.3-40-10.3 4.2-21.1 6.3-32.6 6.3-25.5 0-47.4-9.5-65.7-28.6-18.3-19-27.4-42.1-27.4-69.1 0-3 .4-7.2 1.1-12.6-14.5-8.4-26-20.2-34.6-35.4-8.5-15.2-12.8-31.8-12.8-49.7 0-19 4.8-36.5 14.3-52.3s22.3-27.5 38.3-35.1c-4.2-11.4-6.3-22.9-6.3-34.3 0-27 9.1-50.1 27.4-69.1s40.2-28.6 65.7-28.6c11.4 0 22.3 2.1 32.6 6.3 8-16.4 19.5-29.6 34.6-39.7 15-10.1 31.5-15.2 49.4-15.2s34.4 5.1 49.4 15.1c15 10.1 26.6 23.3 34.6 39.7 10.3-4.2 21.1-6.3 32.6-6.3 25.5 0 47.3 9.5 65.4 28.6s27.1 42.1 27.1 69.1c0 12.6-1.9 24-5.7 34.3 16 7.6 28.8 19.3 38.3 35.1 9.5 15.9 14.3 33.4 14.3 52.4zm-266.9 77.1 105.7-158.3c2.7-4.2 3.5-8.8 2.6-13.7-1-4.9-3.5-8.8-7.7-11.4-4.2-2.7-8.8-3.6-13.7-2.9-5 .8-9 3.2-12 7.4l-93.1 140-42.9-42.8c-3.8-3.8-8.2-5.6-13.1-5.4-5 .2-9.3 2-13.1 5.4-3.4 3.4-5.1 7.7-5.1 12.9 0 5.1 1.7 9.4 5.1 12.9l58.9 58.9 2.9 2.3c3.4 2.3 6.9 3.4 10.3 3.4 6.7-.1 11.8-2.9 15.2-8.7z"
                fill="#1da1f2" /></svg>
    </span>
    <blockquote class="num-tweets">${users[activeUser].tweets.length} tweets</blockquote>
</h2>
</div>
<div class="cover-photo">
<img src="${images[users[activeUser].coverPhotoURL]}" alt="${users[activeUser].displayName} cover photo" id="cover-img" width="598">
</div>
<div class="profile-photo">
<img src="${images[users[activeUser].avatarURL]}" alt="${users[activeUser].displayName} avatar photo" id="profile-img">
</div>
<div class="follow-button">
<button>Follow</button>
</div>
<div class="profile-info">
<h2 class="name">
${users[activeUser].displayName}
    <span class="verified">
        <svg height="25" viewBox="0 0 500 500" width="30" xmlns="http://www.w3.org/2000/svg">
            <path
                d="m512 268c0 17.9-4.3 34.5-12.9 49.7s-20.1 27.1-34.6 35.4c.4 2.7.6 6.9.6 12.6 0 27.1-9.1 50.1-27.1 69.1-18.1 19.1-39.9 28.6-65.4 28.6-11.4 0-22.3-2.1-32.6-6.3-8 16.4-19.5 29.6-34.6 39.7-15 10.2-31.5 15.2-49.4 15.2-18.3 0-34.9-4.9-49.7-14.9-14.9-9.9-26.3-23.2-34.3-40-10.3 4.2-21.1 6.3-32.6 6.3-25.5 0-47.4-9.5-65.7-28.6-18.3-19-27.4-42.1-27.4-69.1 0-3 .4-7.2 1.1-12.6-14.5-8.4-26-20.2-34.6-35.4-8.5-15.2-12.8-31.8-12.8-49.7 0-19 4.8-36.5 14.3-52.3s22.3-27.5 38.3-35.1c-4.2-11.4-6.3-22.9-6.3-34.3 0-27 9.1-50.1 27.4-69.1s40.2-28.6 65.7-28.6c11.4 0 22.3 2.1 32.6 6.3 8-16.4 19.5-29.6 34.6-39.7 15-10.1 31.5-15.2 49.4-15.2s34.4 5.1 49.4 15.1c15 10.1 26.6 23.3 34.6 39.7 10.3-4.2 21.1-6.3 32.6-6.3 25.5 0 47.3 9.5 65.4 28.6s27.1 42.1 27.1 69.1c0 12.6-1.9 24-5.7 34.3 16 7.6 28.8 19.3 38.3 35.1 9.5 15.9 14.3 33.4 14.3 52.4zm-266.9 77.1 105.7-158.3c2.7-4.2 3.5-8.8 2.6-13.7-1-4.9-3.5-8.8-7.7-11.4-4.2-2.7-8.8-3.6-13.7-2.9-5 .8-9 3.2-12 7.4l-93.1 140-42.9-42.8c-3.8-3.8-8.2-5.6-13.1-5.4-5 .2-9.3 2-13.1 5.4-3.4 3.4-5.1 7.7-5.1 12.9 0 5.1 1.7 9.4 5.1 12.9l58.9 58.9 2.9 2.3c3.4 2.3 6.9 3.4 10.3 3.4 6.7-.1 11.8-2.9 15.2-8.7z"
                fill="#1da1f2" /></svg>
    </span>
</h2>
<div class="username">
${users[activeUser].userName}
</div>
<div class="join-date">
    📅 ${users[activeUser].joinedDate}
</div>
<div class="following-specs">
    <div class="following-count">
        <b>${calculateFollowing(users[activeUser].followingCount)}</b> Following
    </div>
    <div class="follower-count">
        <b>${calculateFollowing(users[activeUser].followerCount)}</b> Followers
    </div>
</div>
</div>
<div class="tabs">
<ul>
    <li class="tab">Tweets</li>
    <li class="tab">Tweets & Replies</li>
    <li class="tab">Media</li>
    <li class="tab">Likes</li>
</ul>
</div>
<div class="tweets-container">

</div>
`);

// Function called to populate tweets
populateTweets('.tweets-container', users[activeUser]);

const tabs = document.querySelectorAll('.tab');
// Event listener for tabs
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((temp) => temp.classList.remove('active'));
    tab.classList.add('active');
  });
});
