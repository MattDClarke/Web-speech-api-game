import { sanitize } from 'dompurify';
import { wait } from './util';

async function destroyPopup(popup) {
  popup.classList.remove('open');
  // give the css animation some time to run - fade out
  await wait(1000);
  // remove the popup entirely
  popup.remove();
  // popup still accessible ... removed from DOM not JS memory (usefulness: u may want to add it back)... potential mem leak...
  // fix
  /* eslint-disable no-param-reassign */
  popup = null;
  /* eslint-enable no-param-reassign */
}

// prompt fn
export function ask(options) {
  return new Promise(async function(resolve) {
    // first create a pop up with all the fields in it
    // ... can immidiately add eventlisteners, wouldn't be the case with back ticks ` `...
    // need to listen for submit event on form
    const popup = document.createElement('form');
    const skipButton = document.createElement('button');
    skipButton.type = 'button';
    skipButton.textContent = 'Cancel';
    popup.classList.add('popup');
    popup.insertAdjacentHTML(
      'afterbegin',
      `
    <fieldset>
    <h2>Submit Score</h2>
        <label>${options.title}</label>
        <input type="text" name="input" required autocomplete="off" maxlength="20" autofocus>
        <button type="submit">Submit</button>
    </fieldset>
    `
    );
    popup.firstElementChild.appendChild(skipButton);
    skipButton.addEventListener(
      'click',
      function() {
        resolve(null);
        destroyPopup(popup);
      },
      { once: true }
    );

    // listen for the submit event on the inputs
    popup.addEventListener(
      'submit',
      function(e) {
        e.preventDefault();
        // sanitize user input
        const clean = sanitize(e.target.input.value, {
          FORBID_ATTR: ['width', 'height', 'style'],
          TAGS: ['style'],
        });
        resolve(clean);
        destroyPopup(popup);
      },
      { once: true }
    );
    // when submitted, resolve the data that was in the input box
    // insert that popup into the DOM
    document.body.appendChild(popup);
    // put a very small timeout before we add the open class -> to allow for CSS animation
    await wait(50);
    popup.classList.add('open');
  });
}
