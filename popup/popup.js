(function(){

  var optionEnabled = document.querySelector('#optionEnabled');
  var optionAutofocus = document.querySelector('#optionAutofocus');


  chrome.tabs.query({'active': true, 'currentWindow': true}, function(tab) {
    var url = tab[0].url;
    var domain = url.split('//')[1].split('/')[0];

    chrome.storage.local.get(['disabledSites', 'autofocusSites'], function(sites) {
      if (sites) {
        if (sites.disabledSites && sites.disabledSites.includes(domain)) {
          optionEnabled.checked = false;
        } else {
          optionEnabled.checked = true;
        }

        if (sites.autofocusSites && sites.autofocusSites.includes(domain)) {
          optionAutofocus.checked = true;
        }
      }
    });
  });



  if (optionAutofocus) {
    optionAutofocus.addEventListener('change', updateOptions);
  }

  if (optionEnabled) {
    optionEnabled.addEventListener('change', updateOptions);
  }

  function updateOptions() {

    if (optionEnabled && optionEnabled.checked) {
      var isEnabled = true;

      // slash to search is now enabled
    } else {
      // slash to search is disabled
      if (optionAutofocus) {
        optionAutofocus.checked = false;
      }
    }


    if (optionAutofocus && optionAutofocus.checked) {
      var isAutofocus = true;

      // Autofocus is now enabled
    } else {
      // Autofocus is disabled
    }

    chrome.tabs.query({'active': true, 'currentWindow': true}, function(tab) {
      var url = tab[0].url;
      var domain = url.split('//')[1].split('/')[0];


      chrome.storage.local.get(['disabledSites', 'autofocusSites'], function(sites) {
        var disabledSites = [];
        var autofocusSites = [];

        if (sites.disabledSites) {
          disabledSites = sites.disabledSites;
        }

        if (sites.autofocusSites) {
          autofocusSites = sites.autofocusSites;
        }

        if (!isEnabled && !disabledSites.includes(domain)) {
          // disabling slash to search for domain
          disabledSites.push(domain);
        } else {
          // enabling slash to search for domain
          var domainIndex = disabledSites.indexOf(domain);
          disabledSites.splice(domainIndex, 1);
        }

        if (isAutofocus && !disabledSites.includes(domain)) {
          // enabling autofocus for domain
          autofocusSites.push(domain);
        } else {
          // disabling autofocus for domain
          autofocusSites.splice(domainIndex, 1);
        }


        chrome.storage.local.set({
          disabledSites: disabledSites,
          autofocusSites: autofocusSites
        }, function() {

        });
      });
    });

    appendReloadButton();
  }

  function appendReloadButton() {

    var reloadButton = document.querySelector('#reload-button');

    if (!reloadButton) {

      reloadButton = document.createElement('button');
      reloadButton.textContent = 'Reload to apply changes';
      reloadButton.id = 'reload-button';
      reloadButton.addEventListener('click', function() {

        chrome.tabs.reload();

        window.close();
      });


      var containerDiv = document.querySelector('.container');
      containerDiv.appendChild(reloadButton);
    }

  }
})();
