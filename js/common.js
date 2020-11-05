var isIE = !!window.MSInputMethodContext && !!document.documentMode;

if (isIE) {
    // Create Promise polyfill script tag
    var promiseScript = document.createElement("script");
    promiseScript.type = "text/javascript";
    promiseScript.src =
        "https://cdn.jsdelivr.net/npm/promise-polyfill@8.1.3/dist/polyfill.min.js";

    // Create Fetch polyfill script tag
    var fetchScript = document.createElement("script");
    fetchScript.type = "text/javascript";
    fetchScript.src =
        "https://cdn.jsdelivr.net/npm/whatwg-fetch@3.4.0/dist/fetch.umd.min.js";

    // Add polyfills to head element
    document.head.appendChild(promiseScript);
    document.head.appendChild(fetchScript);

    // Wait for the polyfills to load and run the function. 
    // We could have done this differently, 
    // but I've found it to work well for my use-cases
    setTimeout(function () {
        window
            .fetch("/html/template/header.html")
            .then(function (response) {
                return response.text()
            })
            .then(function (data) {
                checkHeader(data);
            });

        window
            .fetch("/html/template/footer.html")
            .then(function (response) {
                return response.text()
            })
            .then(function (data) {
                document.querySelector("footer").innerHTML = data;
            });/*  */
        window
            .fetch("/html/template/head.html")
            .then(function (response) {
                return response.text()
            })
            .then(function (data) {
                document.querySelector("head").innerHTML = data;
            });/*  */


        window
            .fetch("/html/template/side_nav.html")
            .then(function (response) {
                return response.text()
            })
            .then(function (data) {
                
                activeNavs(data)

            });/*  */

    }, 1000);
} else {
    // If fetch is supported, just run the fetch function

    fetch("/html/template/header.html")
        .then(function (response) {
            return response.text()
        })
        .then(function (data) {
            
            checkHeader(data)
        });


    fetch("/html/template/footer.html")
        .then(function (response) {
            return response.text()
        })
        .then(function (data) {
            document.querySelector("footer").innerHTML = data;
        });/*  */

    fetch("/html/template/head.html")
        .then(function (response) {
            return response.text()
        })
        .then(function (data) {
            document.querySelector("head").innerHTML = data;
        });/*  */



    fetch("/html/template/side_nav.html")
        .then(function (response) {
            return response.text()
        })
        .then(function (data) {
    
            activeNavs(data);
            
        });/*  */
    }
    
    
    function activeNavs(data){
        var html = $.parseHTML(data);
        var paths = location.pathname.split('/');
        var pathCount = paths.length;
        var lastFolder = paths[pathCount - 2];
        var fileName = paths[pathCount - 1];
        fileName = fileName.split('.').slice(0, -1).join('.')
    
        var sMenu = $(html).filter('.side_nav[data-suffix=' + lastFolder + ']');
        var sideMenus = $(sMenu).find('.side_menu li a');
    
        $(sideMenus).each(function (index, element) {
            var hrf = $(element).attr('href');
            var searchValue = new URLSearchParams(location.search).get('search');
            if(location.search != ""){
                if(searchValue != null && $(element).data('search') == searchValue){
                    $(element).addClass('active')
                    $(element).closest('dl').prev('a').addClass('active')
                }
            }else{
                if (hrf && hrf.indexOf(fileName) > -1) {
                    $(element).addClass('active')
                    $(element).closest('dl').prev('a').addClass('active')
                }
            }
        });
    
        $(sMenu).prependTo('aside');

}

function checkHeader(data){
    $(data).prependTo('header');
    if(sessionStorage.getItem('logged_in') == "true"){
        $('#notLoggedIn').remove()
        $('#notLoggedInMob').remove()
    }else{
        $('#LoggedIn').remove()
        $('#LoggedInMob').remove()
    }
}

function menu(obj, e) {
    e.preventDefault();
    var trgt = e.target;
    var isOpen = $(obj).parent().hasClass('open')

    $('.mobile_menu').find('li,dt').removeClass('open')

    $(obj).closest('li').toggleClass('open');

    $(obj).closest('dt').addClass('open');

    if (isOpen) {
        $(obj).parent().removeClass('open')
    }
}

function toggleMenu(action, e) {
    e.preventDefault();
    if (action == 'open') {
        $('.mobile_menu_wrap').addClass('open');
        setTimeout(function () {
            $('.mobile').addClass('open');
        }, 200)
    } else {
        $('.mobile').removeClass('open');
        setTimeout(function () {
            $('.mobile_menu_wrap').removeClass('open');
        }, 200)
    }
}

function cloneRepeat(obj, wrap, count) {
    for (let index = 0; index < count; index++) {
        $(obj).clone().appendTo(wrap)
    }
}

function sideMenu(obj, e) {
    e.preventDefault();
    var subMenu = $(obj).next('dl')
    $('.side_menu dl').not(subMenu).slideUp('open')
    subMenu.slideToggle('open')
}


function inputFile(obj, event) {
    var val = $(this).val();

}
function inputFile(obj, val) {
    var name = val.split('\\').pop();
    $(obj).next('span').text(name)
}


function datepick(trget) {
    event.preventDefault();
    var disabledDays = [0, 6];
    var option = {
        language: 'kr',
        autoClose: true,
        onRenderCell: function (date, cellType) {
            if (cellType == 'day') {
                var day = date.getDay(),
                    isDisabled = disabledDays.indexOf(day) != -1;
                return {
                    disabled: isDisabled
                }
            }
        },


    };
    var myDatepicker = $(trget).datepicker(option).data('datepicker');
    myDatepicker.show();

}

(function ($) {
    $.fn.inputFilter = function (inputFilter) {
        return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    };
}(jQuery));

$("input.onlyNumber").inputFilter(function (value) {
    return /^\d*$/.test(value);    // Allow digits only, using a RegExp
});

$('.custom_select').each(function (index, element) {

    var optionWrap = $(element).find('ul');
    var options = $(element).find('input[type=radio]');

    $(options).change(function () {
        if ($(this).is(':checked')) {
            var text = $(this).next('span').text()
            $(element).find('.selected').text(text)
        }
    })

    $(this).click(function (e) {
        $('.custom_select ul').hide()
        $(optionWrap).toggle(e.target.closest('ul') == null)
    });
});

$('body').click(function (e) {

    if (e.target.closest('.custom_select') == null) {
        $('.custom_select ul').hide()
    }
});


function addComma(n) {
    var reg = /(^[+-]?\d+)(\d{3})/; // 정규식
    n += '';  						// 숫자를 문자열로 변환

    while (reg.test(n))
        n = n.replace(reg, '$1' + ',' + '$2');

    return n;
}


function openLayer(obj) {
    event.preventDefault();
    var href = $(obj).data('href') ? $(obj).data('href') : '';

    $('<div/>', {
        id: 'modal',
        "class": 'popup_wrapper'
    }).appendTo('body');

    $('#modal').waitMe({
        effect: 'win8',
        text: '',
        bg: '',
        color: 'white',
        textPos: 'vertical',
    })

    if (href == '') {
        alert('no link')
        return false;
    }
    setTimeout(function () {
        $.ajax({
            type: "get",
            url: href,
            success: function (response) {
                $('#modal').waitMe("hide")
                $(response).appendTo('#modal');
            }
        });
    }, 1000);

}

function closeLayer(){
    event.preventDefault();
    $('#modal').hide()
    $('#modal').remove()
}


class user {
    constructor(id,pass,type){
        this.id = id;
        this.pass = pass;
        this.type = type;
    }
    checkId(id,pass){
        return this.id == id && this.pass == pass;
    }
}

let users = [
    new user('user','123','freelancer'),    
    new user('client','123','client')
]

//var loggedIn = '<a href="/html/login.html" class="btn btn_sm white">로그아웃</a><a href="/html/mypage.html" class="btn btn_sm black">마이페이지</a>'


function checkLogin(){
    
    var id = document.getElementById('user_id').value;
    var pass = document.getElementById("user_pass").value;
    var userExist = false;
    for (i = 0; i < users.length; i++) {
        if(users[i].id == id){
            var type = users[i].type;
            if(users[i].checkId(id,pass)){
                userExist = true;
                doLogin(type,id);
            }
            break;
        }
    }
    if(!userExist){
        alert('없는 아이디입니다.')
    }
}

function doLogin(type,id){
    sessionStorage.setItem('logged_in', true);
    sessionStorage.setItem('user_id', id);
    sessionStorage.setItem('user_type', type);
    location.href = "/html/main.html"
}

function doLogout(){
    sessionStorage.setItem('logged_in', false);
    sessionStorage.setItem('user_id', "");
    sessionStorage.setItem('user_type', "");
    location.href = "/html/main.html"
}
function myPage(){
    var user_type = sessionStorage.getItem('user_type');
    var mypage = user_type == "client" ? "/html/mypage/client/pending_project.html":"/html/mypage/freelancer/myprofile.html"
    location.href = mypage
}