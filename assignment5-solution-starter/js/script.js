$(function () {
  $("#navbarToggle").blur(function () {
    if (window.innerWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
});

(function (global) {
  var dc = {};

  var homeHtmlUrl = "snippets/home-snippet.html";
  var allCategoriesUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/category-snippet.html";
  var menuItemsUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
  var menuItemsTitleHtml = "snippets/menu-items-title.html";
  var menuItemHtml = "snippets/menu-item.html";

  var insertHtml = function (selector, html) {
    document.querySelector(selector).innerHTML = html;
  };

  var showLoading = function (selector) {
    insertHtml(selector, "<div class='text-center'><img src='images/ajax-loader.gif'></div>");
  };

  var insertProperty = function (string, propName, propValue) {
    return string.replace(new RegExp("{{" + propName + "}}", "g"), propValue);
  };

  var switchMenuToActive = function () {
    document.querySelector("#navHomeButton").classList.remove("active");
    document.querySelector("#navMenuButton").classList.add("active");
  };

  document.addEventListener("DOMContentLoaded", function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowHomeHTML, true);
  });

  function buildAndShowHomeHTML(categories) {
    $ajaxUtils.sendGetRequest(homeHtmlUrl, function (homeHtml) {
      var chosenCategoryShortName = "'" + chooseRandomCategory(categories).short_name + "'";
      var homeHtmlToInsert = insertProperty(homeHtml, "randomCategoryShortName", chosenCategoryShortName);
      insertHtml("#main-content", homeHtmlToInsert);
    }, false);
  }

  function chooseRandomCategory(categories) {
    return categories[Math.floor(Math.random() * categories.length)];
  }

  dc.loadMenuCategories = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
  };

  dc.loadMenuItems = function (categoryShort) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(menuItemsUrl + categoryShort + ".json", buildAndShowMenuItemsHTML);
  };

  function buildAndShowCategoriesHTML(categories) {
    $ajaxUtils.sendGetRequest(categoriesTitleHtml, function (categoriesTitleHtml) {
      $ajaxUtils.sendGetRequest(categoryHtml, function (categoryHtml) {
        switchMenuToActive();
        var categoriesViewHtml = buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml);
        insertHtml("#main-content", categoriesViewHtml);
      }, false);
    }, false);
  }

  function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml) {
    var finalHtml = categoriesTitleHtml + "<section class='row'>";
    categories.forEach(category => {
      var html = insertProperty(categoryHtml, "name", category.name);
      html = insertProperty(html, "short_name", category.short_name);
      finalHtml += html;
    });
    return finalHtml + "</section>";
  }

  function buildAndShowMenuItemsHTML(categoryMenuItems) {
    $ajaxUtils.sendGetRequest(menuItemsTitleHtml, function (menuItemsTitleHtml) {
      $ajaxUtils.sendGetRequest(menuItemHtml, function (menuItemHtml) {
        switchMenuToActive();
        var menuItemsViewHtml = buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml);
        insertHtml("#main-content", menuItemsViewHtml);
      }, false);
    }, false);
  }

  function buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml) {
    menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "name", categoryMenuItems.category.name);
    menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "special_instructions", categoryMenuItems.category.special_instructions);
    var finalHtml = menuItemsTitleHtml + "<section class='row'>";
    categoryMenuItems.menu_items.forEach(item => {
      var html = insertProperty(menuItemHtml, "short_name", item.short_name);
      html = insertProperty(html, "name", item.name);
      html = insertProperty(html, "description", item.description);
      finalHtml += html;
    });
    return finalHtml + "</section>";
  }

  global.$dc = dc;
})(window);
