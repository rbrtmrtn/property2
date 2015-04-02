$(document).ready(function(){function t(t){t.wrap("<div class='table-wrapper' />");var e=t.clone();e.find("td:not(:first-child), th:not(:first-child)").css("display","none"),e.removeClass("responsive"),t.closest(".table-wrapper").append(e),e.wrap("<div class='pinned' />"),t.wrap("<div class='scrollable' />"),o(t,e)}function e(t){t.closest(".table-wrapper").find(".pinned").remove(),t.unwrap(),t.unwrap()}function o(t,e){var o=t.find("tr"),a=e.find("tr"),p=[];o.each(function(t){var e=$(this),o=e.find("th, td");o.each(function(){var e=$(this).outerHeight(!0);p[t]=p[t]||0,e>p[t]&&(p[t]=e)})}),a.each(function(t){$(this).height(p[t])})}var a=!1,p=function(){return $(window).width()<767&&!a?(a=!0,$("table.responsive").each(function(e,o){t($(o))}),!0):void(a&&$(window).width()>767&&(a=!1,$("table.responsive").each(function(t,o){e($(o))})))};$(window).load(p),$(window).on("redraw",function(){a=!1,p()}),$(window).on("resize",p)}),function(t){t.deparam=function(e,o){var a={},p={"true":!0,"false":!1,"null":null};return t.each(e.replace(/\+/g," ").split("&"),function(e,s){var r,n=s.split("="),i=decodeURIComponent(n[0]),h=a,c=0,d=i.split("]["),l=d.length-1;if(/\[/.test(d[0])&&/\]$/.test(d[l])?(d[l]=d[l].replace(/\]$/,""),d=d.shift().split("[").concat(d),l=d.length-1):l=0,2===n.length)if(r=decodeURIComponent(n[1]),o&&(r=r&&!isNaN(r)?+r:"undefined"===r?void 0:void 0!==p[r]?p[r]:r),l)for(;l>=c;c++)i=""===d[c]?h.length:d[c],h=h[i]=l>c?h[i]||(d[c+1]&&isNaN(d[c+1])?{}:[]):r;else t.isArray(a[i])?a[i].push(r):a[i]=void 0!==a[i]?[a[i],r]:r;else i&&(a[i]=o?void 0:"")}),a}}(jQuery);var app={};window.app=app,app.hooks={},$("[data-hook]").each(function(t,e){var o=$(e),a=o.data("hook").replace(/-([a-z])/g,function(t){return t[1].toUpperCase()});app.hooks[a]=o}),$("#templates").detach(),app.hooks.frontLink=$("<a>").attr("href",window.location.pathname).on("click",function(t){if(!(t.ctrlKey||t.altKey||t.shiftKey)){var e=$(t.target),o=e.attr("href");t.preventDefault(),window.scroll(0,0),window.location.search&&(history.pushState(null,e.text(),o),app.views.front())}}),app.hooks.crumbs.update=function(t){var e=this;e.hooks=e.hooks||{},e.hooks.app=e.hooks.app||e.find("li").last(),e.hooks.appText=e.hooks.appText||e.hooks.app.contents(),e.hooks.appLink=e.hooks.appLink||app.hooks.frontLink.clone(!0).text(e.hooks.app.text()),e.hooks.crumb&&e.hooks.crumb.detach(),t?(e.hooks.appText.detach(),e.hooks.app.append(e.hooks.appLink),e.hooks.crumb=t,e.append(e.hooks.crumb)):(e.hooks.appLink.detach(),e.hooks.app.append(e.hooks.appText))},app.hooks.appTitle.contents().wrap(app.hooks.frontLink),app.hooks.search.parent().on("submit",function(t){if(!(t.ctrlKey||t.altKey||t.shiftKey)){t.preventDefault();var e=t.target.elements.q;e.blur(),history.pushState(null,e.value,"?"+$.param({q:e.value})),app.views.results(e.value)}}),app.views={},app.route=function(){var t=$.deparam(window.location.search.substr(1));t.q?app.views.results(t.q):t.p?app.views.property(t.p):app.views.front()},$(app.route),window.onpopstate=app.route,history.pushState||(history.pushState=function(t,e,o){window.location=o},history.replaceState=function(t){history.state=t}),app.util={},app.util.addressWithUnit=function(t){var e=t.unit||"";return e&&(e=" #"+e.replace(/^0+/,"")),t.full_address+e},app.views.front=function(){app.hooks.crumbs.update(),app.hooks.search.val("").attr("placeholder","Enter address, account number, intersection, or city block"),app.hooks.searchLeft.removeClass("medium-14").addClass("medium-4").html("&nbsp;"),app.hooks.searchBox.removeClass("medium-10").addClass("medium-16"),app.hooks.content.children().detach(),app.hooks.content.append(app.hooks.front)},app.views.results=function(t){function e(){var t=history.state;return t.error?app.hooks.content.text(t.error):(app.hooks.content.empty(),app.hooks.count.find("#total").text(t.total),app.hooks.content.append(app.hooks.count),app.hooks.results.empty(),t.data.properties.forEach(function(t){var e=app.hooks.result.clone(),o=t.property_id,a=app.util.addressWithUnit(t),p="?"+$.param({p:o});e.find("a").attr("href",p).text(a).on("click",function(e){e.ctrlKey||e.altKey||e.shiftKey||(e.preventDefault(),history.pushState({opa:t,address:a},a,p),app.views.property(o))}),e.appendTo(app.hooks.results)}),void app.hooks.content.append(app.hooks.results))}function o(t){return-1!==t.indexOf(" #")?t=t.replace(" #","/"):t+="/",t}app.hooks.resultsCrumb.find("b").text(t),app.hooks.crumbs.update(app.hooks.resultsCrumb),app.hooks.search.val(t),app.hooks.searchLeft.removeClass("medium-14").addClass("medium-4").html("&nbsp;"),app.hooks.searchBox.removeClass("medium-10").addClass("medium-16"),app.hooks.content.children().detach(),history.state?e():(app.hooks.content.text("Loading..."),$.ajax("http://api.phila.gov/opa/v1.1/address/"+encodeURIComponent(o(t))+"?format=json").done(function(t){history.replaceState(t,""),e()}).fail(function(){history.replaceState({error:"Failed to retrieve results. Please try another search."},""),e()}))},app.views.property=function(t){function e(){n=!0,$.ajax("http://api.phila.gov/opa/v1.1/property/"+t+"?format=json").done(function(t){var e=$.extend({},history.state),s=t.data.property;e.opa=s,e.address=app.util.addressWithUnit(s),history.replaceState(e,""),i||a(),h||p(),e.sa||o()}).fail(function(){history.replaceState({error:!0},""),r()})}function o(){$.ajax("https://api.phila.gov/ulrs/v3/addresses/"+encodeURIComponent(history.state.address)+"/service-areas?format=json").done(function(t){var e=$.extend({},history.state);e.sa=t.serviceAreaValues,history.replaceState(e,""),s()}).fail(function(){var t=$.extend({},history.state);t.sa={error:!0},history.replaceState(t,"")})}function a(){var t=history.state;app.hooks.propertyCrumb.text(t.address),app.hooks.crumbs.update(app.hooks.propertyCrumb),app.hooks.propertyTitle.find("h1").text(t.address),app.hooks.propertyTitle.find(".small-text").text("#"+t.opa.account_number),app.hooks.content.empty(),app.hooks.propertyOwners.empty(),t.opa.ownership.owners.forEach(function(t){app.hooks.propertyOwners.append($("<div>").text(t))}),app.hooks.improvementDescription.text(t.opa.characteristics.description),app.hooks.landArea.text(t.opa.characteristics.land_area),app.hooks.improvementArea.text(t.opa.characteristics.improvement_area),app.hooks.zoning.text(t.opa.characteristics.zoning_description),app.hooks.propertyMailingHeader.detach(),app.hooks.propertyMailing.empty(),app.hooks.valuation.empty(),app.hooks.content.append(app.hooks.propertySide),app.hooks.content.append(app.hooks.propertyMain),i=!0}function p(){var t=history.state,e=app.hooks.propertyMailing,o=t.opa.ownership.mailing_address;app.hooks.propertyMailingHeader.insertBefore(e),e.append($("<div>").text(o.street)),e.append($("<div>").text(o.city+", "+o.state)),e.append($("<div>").text(o.zip)),t.opa.valuation_history.forEach(function(t){var e=$("<tr>");e.append($("<td>").text(t.certification_year)),e.append($("<td>").text(t.market_value)),e.append($("<td>").text(t.improvement_taxable)),e.append($("<td>").text(t.land_taxable)),e.append($("<td>").text(t.total_exempt)),e.append($("<td>").text(t.taxes)),app.hooks.valuation.append(e)}),h=!0}function s(){var t=history.state;t.error||t.sa.error||i&&t.sa&&t.sa.forEach(function(t){"SA_STREETS_Rubbish_Recyc"===t.serviceAreaId?app.hooks.rubbishDay.text(t.value):"SA_SCHOOLS_Elementary_School_Catchment"===t.serviceAreaId&&app.hooks.elementarySchool.text(t.value)})}function r(){}var n,i,h;return app.hooks.propertyTitle.find("h1").html("&nbsp;"),app.hooks.propertyTitle.find(".small-text").empty(),app.hooks.search.val(""),app.hooks.search.attr("placeholder","Search for another property"),app.hooks.searchLeft.removeClass("medium-4").addClass("medium-14").empty().append(app.hooks.propertyTitle),app.hooks.searchBox.removeClass("medium-16").addClass("medium-10"),app.hooks.content.children().detach(),history.state||history.replaceState({},""),history.state.error?r():(history.state.opa?a():(app.hooks.content.text("Loading..."),e()),history.state.opa&&!history.state.opa.address_match?p():n||e(),void(history.state.sa?s():history.state.address&&o()))};