$(document).ready((_) => {
  // Menu Toggle
  const menuWidth = $("#side-menu .menu").outerWidth();
  let btn_toggle = 1;

  $("#btnToggle").click(function (e) {
    btn_toggle ? showNavbar() : hideNavbar();
  });

  // Show Side Nav Bar
  function showNavbar() {
    $("#btnToggle").children().eq("0").hide(400);
    $("#btnToggle").children().eq("1").show(400);

    $("#side-menu").animate(
      {
        left: 0,
      },
      400
    );

    $(".list-links")
      .children()
      .addClass("animate__animated animate__fadeInUpBig");

    btn_toggle = !btn_toggle;
  }
  // Hide Side Nav Bar
  function hideNavbar() {
    $("#btnToggle").children().eq("0").show(400);
    $("#btnToggle").children().eq("1").hide(400);

    $("#side-menu").animate(
      {
        left: -menuWidth,
      },
      400
    );

    $(".list-links")
      .children()
      .removeClass("animate__animated animate__fadeInUpBig");

    btn_toggle = !btn_toggle;
  }

  $("#nav_Menu")
    .children()
    .on("click", function () {
      const secID = $(this).text();
      
      hideSection();

      
      hideNavbar();

      
      $(`#${secID}`).css("display", "block");

      if (secID == "categories") {
        
        searchCategories();
      } else if (secID == "area") {
        
        searchAreaMeals();
      } else if (secID == "ingredients") {
       
        getIngredients();
      }

    });

 
  function hideSection() {
    let nav_links = Array.from($("#nav_Menu").children());

    nav_links.forEach((sec) => {
      $(`#${sec.textContent}`).css("display", "none");
    });

   
    $("#meals-boxes").css("display", "none");
  
    $("#meal-details").css("display", "none");
  }
 






  
  

  $("#searchByName , #searchByFLetter").on("input", searchMeals);

  
  async function searchMeals() {
   
    showLoadingPage();
    let searchText = $(this).val();

   
    let searchType = $(this).attr("id") == "searchByName" ? "s" : "f";

   
    if (searchText != "") searchText = `=${searchText}`;
    else searchType = "s";

    const MealsArray = (
      await getAPI(
        `https://www.themealdb.com/api/json/v1/1/search.php?${searchType}${searchText}`
      )
    ).meals;

    if (MealsArray) {
      showListBoxes(MealsArray, mealsBoxesBody, "meals-boxes", createMealBox);
    } else {
      showLoadingPage();
    }
  }
 

  $("#contactForm").on("submit", (e) => e.preventDefault());

  
  function vaildateForm() {
    let validForm = true;
    $("#contactForm input").each(function () {
      if (!$(this).hasClass("is-valid")) {
        validForm = false;
      }
    });

   
    if (validForm) {
      $("#btnSubmit").removeAttr("disabled");
    } else {
      $("#btnSubmit").attr("disabled", "");
    }
  }


  $("#userName").on("input", function () {
    toggleClasses(!/[^a-zA-Z\s_]/.test(this.value), this);

  
    vaildateForm();
  });

  // check validate of User Email Input
  $("#userEmail").on("input", function () {
    toggleClasses(
      /^([a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,6})*$/.test(this.value),
      this
    );

    
    vaildateForm();
  });

  
  $("#userPhone").on("input", function () {
    toggleClasses(/^\d{11}$/.test(this.value), this);

    
    vaildateForm();
  });

  
  $("#userAge").on("input", function () {
    toggleClasses(this.value >= 15 && this.value <= 99, this);

    
    vaildateForm();
  });

  
  $("#userPassword").on("input", function () {
    toggleClasses(/^(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(this.value), this);

    
    vaildateForm();
  });

  
  $("#userConfirmPassword").on("input", function () {
    toggleClasses(this.value == userPassword.value, this);

   
    vaildateForm();
  });

  
  function toggleClasses(valid, element) {
    if (valid) {
      element.classList.add("is-valid");
      element.classList.remove("is-invalid");
    } else {
      element.classList.add("is-invalid");
      element.classList.remove("is-valid");
    }
  }
 
  (async function () {
    const MealsArray = (
      await getAPI(`https://www.themealdb.com/api/json/v1/1/search.php?s`)
    ).meals;

    showListBoxes(MealsArray, mealsBoxesBody, "meals-boxes", createMealBox);

   
  })();
});


function hideLoadingPage() {
  $("#loading-page").hide(600, (_) => {
    $("body,html").css("overflow-y", "auto");
  });
}


function showLoadingPage() {
 
  if ($("#search").css("display") != "none") {
    $("#loading-page").css({
      height: `calc( 100vh - ${$("#search").outerHeight()}px)`,
      top: `${$("#search").outerHeight() + 50}px`,
    });
  } else {
  
    $("#loading-page").css({
      height: `100%`,
      top: `0`,
    });
  }

  $("#loading-page").show(300, (_) => {
    $("body,html").css("overflow-y", "hidden");
  });
}

async function getAPI(url) {
  let resp = await fetch(url);

  return await resp.json();
}

function showListBoxes(list, boxesBody, boxesContainerId, createItemFunc) {
  let listFragment = ``;
  list.forEach((item) => {
    listFragment += createItemFunc(item);
  });

  boxesBody.innerHTML = listFragment;
  
  $(`#${boxesContainerId}`).show(100, hideLoadingPage);
}


function createMealBox({ strMealThumb: imgURL, strMeal: mealName, idMeal }) {
  return `  
  <div onclick="showMealDetails('${idMeal}')">
    <div class="box rounded-3">
        <div class="box-img">
            <img src="${imgURL}" alt="" class="w-100">
        </div>
        <div class="box-brief d-flex align-items-center justify-content-center bg-light bg-opacity-75 px-2">
            <h2 class="text-capitalize text-dark text-center" title="${mealName}">${mealName}</h2>
        </div>
    </div>
  </div>`;
}


async function showMealDetails(id) {
  
  $("#search").css("display", "none");
  
  showLoadingPage();

  
  const mealINFO = (
    await getAPI(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
  ).meals[0];


  $("#meals-boxes").css("display", "none");

  let {
    strMealThumb,
    strMeal,
    strInstructions,
    strArea,
    strCategory,
    strTags,
    strSource,
    strYoutube,
  } = mealINFO;

  $("#meal-details .meal-img img").attr("src", strMealThumb); 
  $("#meal-details .meal-name").text(strMeal); 

  $("#meal-details #mealInstruction").text(strInstructions); 

  $("#meal-details #mealArea").text(strArea); 

  $("#meal-details #mealCategory").text(strCategory); 

  $("#meal-details #mealRecipes").text(strArea); 

  
  if (mealINFO[`strIngredient1`] != "") {
    let recipesContent = "",
      i = 1;
    while (mealINFO[`strIngredient${i}`]) { 
      recipesContent += `
          <span class="bg-white bg-opacity-75 py-2 px-3 rounded-3">
            ${mealINFO[`strMeasure${i}`]} ${mealINFO[`strIngredient${i}`]}
          </span>
      `;
      i++;
    }
    $("#meal-details #mealRecipes").html(recipesContent); 
  } else {
   
    $("#meal-details #mealRecipes").parent().css("display", "none");
  }

  
  if (strTags) {
    strTags = strTags.split(",").map(
      (tag) => `
      <span class="bg-white bg-opacity-75 py-2 px-3 rounded-3">
          ${tag.trim()}
      </span>
    `
    );
    $("#meal-details #mealTags").html(strTags); 
  } else {
    
    $("#meal-details #mealTags").parent().css("display", "none");
  }

  $("#meal-details #btnSource").attr("href", strSource); 
  $("#meal-details #btnYoutube").attr("href", strSource); 

  
  $("#meal-details").css("display", "block");
  
  hideLoadingPage();
}


async function searchCategories() {
  showLoadingPage();

  const Cat = (
    await getAPI(`https://www.themealdb.com/api/json/v1/1/categories.php`)
  ).categories;

  showListBoxes(Cat, catBoxesBody, "categories", createCategoryBox);
}


function createCategoryBox({
  strCategory: catName,
  strCategoryDescription: catDesc,
  strCategoryThumb: catImg,
}) {
  let catDescmini = catDesc.split(" ");
  catDescmini.length = 20;
  catDescmini = catDescmini.join(" ");

  return `
  <div>
    <div class="box rounded-3" onclick="showCategoryMeals('${catName}')">
      <div class="box-img">
          <img src="${catImg}" alt="" class="w-100">
      </div>
      <div
          class="box-brief d-flex flex-column text-center align-items-center justify-content-center bg-light bg-opacity-75 px-2">
          <h2 class="text-capitalize text-dark" title="${catName}">${catName}</h2>
          <p class="text-muted" title="${catDesc}" >${catDescmini}</p>
      </div>
    </div>
  </div>
  `;
}


async function showCategoryMeals(catName) {
  
  showLoadingPage();
  
  $("#categories").css("display", "none");

  const MealsArray = (
    await getAPI(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${catName}`
    )
  ).meals;

  showListBoxes(MealsArray, mealsBoxesBody, "meals-boxes", createMealBox);
}

async function searchAreaMeals() {
  showLoadingPage();

  const AreaData = (
    await getAPI("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
  ).meals;

  showListBoxes(AreaData, areaBoxesBody, "area", createAreaBox);
}


function createAreaBox({ strArea }) {
  return `
      <div>
        <div class="city text-center border border-1 border-white p-4"
          onclick="showAreaMeals('${strArea}')" >
            <i class="fa fa-city text-gray fa-4x"></i>
            <h2 class="text-white mb-0 mt-3" title="${strArea}" >${strArea}</h2>
        </div>
      </div>  
  `;
}


async function showAreaMeals(areaName) {
  
  showLoadingPage();
  
  $("#area").css("display", "none");

  const MealsArray = (
    await getAPI(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`
    )
  ).meals;

  showListBoxes(MealsArray, mealsBoxesBody, "meals-boxes", createMealBox);
}

async function getIngredients() {
  showLoadingPage();

  let IngredientsData = (
    await getAPI(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
  ).meals;
  IngredientsData.length = 20;

  showListBoxes(
    IngredientsData,
    ingredBoxesBody,
    "ingredients",
    createIngredientBox
  );
}


function createIngredientBox({ strDescription, strIngredient }) {
  return `
    <div>
      <div class="ingredient text-center border border-1 border-white py-4 px-2"
        onclick="showIngredientsMeals('${strIngredient}')" >
          <i class="fas fa-cloud-meatball fa-4x text-gray"></i>
          <h2 class="text-white fw-bold m-3" title="${strIngredient}" >${strIngredient}</h2>
          <p class="ingredient-desc text-muted lh-sm mb-0" title="${strDescription}" >${strDescription}</p>
      </div>
    </div>
  `;
}


async function showIngredientsMeals(ingredientName) {
  
  showLoadingPage();
 
  $("#ingredients").css("display", "none");

  const MealsArray = (
    await getAPI(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientName}`
    )
  ).meals;

  showListBoxes(MealsArray, mealsBoxesBody, "meals-boxes", createMealBox);
}

