const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];


// Show Modal, Focus on Input

function showModal(){

    modal.classList.add('show-modal');
    websiteNameEl.focus();
}


// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));


// Validate Form

function validateForm(nameValue, urlValue){

    const expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g;
    const regex = new RegExp(expression);

    if (!nameValue || !urlValue){
        alert('Please submit values for both feilds!');
    }

    if(!urlValue.match(regex)){
        alert('Please provide a valid web address');
        return false;
    }

    //Valid
    return true;
}

// Delete Bookmark

function deleteBookmark(url){

    bookmarks.forEach((bookmark, i) => {
        console.log('Inside loop' , i, url, bookmarks);
        if (bookmark.url === url){
            console.log(i);
            // splice( index, no_of_objects_to_be_removed)
            bookmarks.splice(i, 1);
            console.log(bookmark);
        }
    });  
    // Update bookmarks array in localStorage, re-populate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    
    fetchBookmarks();   
}

// Build Bookmark DOM

function buildBookmark(){

    // Remove All Bookmark elements - Setting text node to remove all the current bookmark items.
    bookmarksContainer.textContent = '';

    // Build Items
    bookmarks.forEach(bookmark => {
        const {name, url} = bookmark;

        // Create Item
        const item = document.createElement('div');
        item.classList.add('item');

        //Close Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);

        // Favicon Link Container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');

        //favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');

        // Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;

        //Append to Bookmark container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);

    });
}


// Fetch Bookmarks from Local storage
function fetchBookmarks(){

    // Get Bookmarks from localStorage if available
    if(localStorage.getItem('bookmarks')){

        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }
    else{
        
        // Create boomarks array in localStorage
        bookmarks = [
            {
                name : 'KK Design Studio',
                url : 'https://kkdesignstudio.com',
            },
        ];

        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));     
    }
    
    buildBookmark();
}

// Handle Data from Form
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;

    if (!urlValue.includes('http://') && !urlValue.includes('https://')){
        urlValue = `https://${urlValue}`;
    }

    if (!validateForm(nameValue, urlValue)){
        return false;
    }

    const bookmark = {
        name : nameValue,
        url : urlValue
    };

    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);

// On Load, Fetch Bookmarks
fetchBookmarks();