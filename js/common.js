fetch("html/template/header.html")
    .then(response => {
        return response.text()
    })
    .then(data => {
        document.querySelector("header").innerHTML = data;
    });

fetch("html/template/footer.html")
    .then(response => {
        return response.text()
    })
    .then(data => {
        document.querySelector("footer").innerHTML = data;
    });/*  */

fetch("html/template/head.html")
    .then(response => {
        return response.text()
    })
    .then(data => {
        document.querySelector("head").innerHTML = data;
    });/*  */


fetch("html/template/side_nav.html")
    .then(response => {
        return response.text()
    })
    .then(data => {

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
            if (hrf && hrf.indexOf(fileName) > -1) {
                $(element).addClass('active')
                $(element).closest('dl').prev('a').addClass('active')
            }
        });

        $(sMenu).appendTo('aside');

    });/*  */

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

