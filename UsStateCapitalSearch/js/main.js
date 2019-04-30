const search = document.querySelector('#search')
const matchList = document.querySelector('#match-list')
let states;

// Get states
const getStates = async () => {
  const res = await fetch('../data/states.json');
  states = await res.json();
};

//Search states.json and filter it
const searchState = searchText => {
  // Get matches to current text input 
  let matches = states.filter(state => {
    const regex = new RegExp(`^${searchText}`, 'gi'); // ^ starts with rearch text
    return state.name.match(regex) || state.abbr.match(regex);
  });

   // Clear when input or matches are empty
  if (searchText.length === 0) {
    matches = [];
    matchList.innerHTML = '';
  }

  // Show warning if no matches
  if (matches.length === 0 && searchText.length > 0) {
    outputHtmlOnError();
  }

  outputHtml(matches);
};

//Show results in HTML
const outputHtml = matches => {
  if (matches.length > 0) {
    const html = matches.map(match =>
      `<div class="card card-body mb-1">
      <h4>${match.name} (${match.abbr}) <span class="text-primary">
      ${match.capital}</span></h4>
      <small>Lat: ${match.lat} / Long: ${match.long}</small>
    </div>`
    );
    let htmlResolved = html.join('')
    matchList.innerHTML = htmlResolved;
  }
}

//Show if there is no matches
const outputHtmlOnError = () => {
  const err = `<div class="card card-body mb-1">
  <h4><span class="text-warning">Oops..Please check your city</span></h4>
  </div>
  `
  matchList.innerHTML = err;
}

window.addEventListener('DOMContentLoaded', getStates);
search.addEventListener('input', () => searchState(search.value));


