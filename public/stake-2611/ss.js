  const className = "ss-dl",
    domain = "holustudio";
  let variables = {};
  const findQuery = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term"];
  function setQuery(queryVars) {
    const urlParams = new URLSearchParams(window.location.search);
    queryVars.map(function (fieldName) {
      let paraValue = urlParams.get(fieldName);
      paraValue ? (setScopeParam(fieldName, paraValue)) : null;
    });
  }
  function getIp() {
    fetch("https://api.ipify.org/?format=json")
      .then((results) => results.json())
      .then((data) => { setScopeParam("client_ip_address", data.ip); })
      .catch((error) => { console.error(error); });
  }
  function getUserClient() { setScopeParam("client_user_agent", navigator.userAgent); }
  function getCookie(name) {
    let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }
  function setFbParam(param, name) { let f = getCookie(param); loop(param, f, name, 50); }
  function loop(param, f, name, n) {
    setTimeout(function () {
      f = getCookie(param);
      if (f == undefined) { n = --n; if (n > 0) { loop(param, f, name, n); } }
      else { setScopeParam(name, f); }
    }, 200);
  }
  function setScopeParam(name, value) { variables[name] = value; }
  getIp(); getUserClient(); setQuery(findQuery);
  setFbParam("_fbp", "fbp"); setFbParam("_fbc", "fbc");
  if (typeof ssDeepLink === 'function') { ssDeepLink(className, domain, false, { variables: variables }); }
