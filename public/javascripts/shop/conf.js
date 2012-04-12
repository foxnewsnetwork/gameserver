/****************************
* Constant Configurations        *
*****************************/
// Global constants
var PATH_NAME = "http://localhost:3000/";
var a = alice.init();

// Easy mode setup
var MALL_WIDTH = window.innerWidth,
	MALL_HEIGHT = window.innerHeight,
	DEFAULT_SHOP_WIDTH = 380,
	DEFAULT_SHOP_HEIGHT = 85,
	DEFAULT_ELEMENT_ID = "InGidioClientShopHypeDog",
	DEFAULT_SHOP_X = 0,
	DEFAULT_SHOP_Y = 0,
	DEFAULT_SHOP_Z = 500,
	DEFAULT_TILE_Z = 750,
	DEFAULT_UI_Z = 750,
	DEFAULT_BACKGROUND_COLOR = "rgb( 10, 10, 10 )" ,
	DEFAULT_BACKGROUND_BORDER = "solid 3px",
	DEFAULT_BACKGROUND_IMAGE = PATH_NAME + "images/shopicons/placeholder.png";
	DEFAULT_TILE_WIDTH = 75,
	DEFAULT_TILE_HEIGHT= 75,
	DEFAULT_BUTTON_WIDTH = 75,
	DEFAULT_BUTTON_HEIGHT = 75,
	DEFAULT_COLUMN_PER = 1,
	DEFAULT_ROW_PER = 4 ,
	DEFAULT_BUTTON_WIDTH = 75,
	DEFAULT_FORM_BORDER = "solid 3px",
	DEFAULT_FORM_COLOR = "rgb( 200, 200, 200)" ,
	DEFAULT_FORM_WIDTH = 200,
	DEFAULT_FORM_HEIGHT = 360,
	DEFAULT_FLASH_BORDER = "solid 1px",
	DEFAULT_FLASH_COLOR = "rgb( 178, 205, 105)" ,
	DEFAULT_FLASH_WIDTH = 160,
	DEFAULT_FLASH_HEIGHT = 45,
	CONFIRMATION_WIDTH = 160,
	CONFIRMATION_HEIGHT = 85,
	SMALL_BUTTON_WIDTH = 25,
	SMALL_BUTTON_HEIGHT = 25,
	DEFAULT_ARROW_WIDTH = 40,
	DEFAULT_ARROW_HEIGHT = 35 ,
	DEFAULT_CARD_WIDTH = 246 ,
	DEFAULT_CARD_HEIGHT = 75;
		
// Normal mode setup

var SHOP_IMAGE_APPROVE = "images/shopicons/approve.png",  
SHOP_IMAGE_CANCEL = "images/shopicons/Close.png";

var SPECS_PAYMENTFORM = [
	{
		'tag' : 'div',
		'content' : "Checkout!"
	},
	{
		'tag' : 'div',
		'content' : "Name: "
	},
	{ 
		'tag' : "input",
		'type' : "text",
		'id' : 'name' ,
		'placeholder' : 'ex. Jack Jackson'
	},
	{
		'tag' : 'div',
		'content' : "Credit Card Number: "
	},
	{ 
		'tag' : "input",
		'type' : "text",
		'id' : 'creditcardnumber' ,
		'placeholder' : 'ex. 1234 4567 8901 2345'
	},
	{
		'tag' : 'div',
		'content' : "CCV: "
	},
	{ 
		'tag' : "input",
		'type' : "text",
		'id' : 'ccv' ,
		'placeholder' : 'ex. 449'
	},
	{
		'tag' : 'div',
		'content' : "Expiration: "
	},
	{ 
		'tag' : "input",
		'type' : "number",
		'id' : 'expiremonth' ,
		'placeholder' : '1',
		'size' : 30,
		'style' : "width: 2em"
	},
	{ 
		'tag' : "input",
		'type' : "number",
		'id' : 'expireyear' ,
		'placeholder' : '2012',
		'size' : 30,
		'style' : "width: 3em"
	},
	{
		'tag' : 'div',
		'content' : "Email: "
	},
	{ 
		'tag' : "input",
		'type' : "text",
		'id' : 'email' ,
		'placeholder' : 'ex. example@ex.com'
	}
];


// Hard mode setup


