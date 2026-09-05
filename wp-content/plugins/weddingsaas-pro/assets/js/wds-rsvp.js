function getComments_SAIC(post_id, num_comments, num_get_comments, order_comments) {
    var status = jQuery("#saic-comment-status-" + post_id),
        $container_comments = jQuery("ul#saic-container-comment-" + post_id);
    return num_comments > 0 && jQuery.ajax({
        type: "POST",
        dataType: "html",
        url: WDS_RSVP.ajaxurl,
        data: {
            action: "get_comments",
            post_id: post_id,
            get: num_get_comments,
            order: order_comments,
            nonce: WDS_RSVP.nonce
        },
        beforeSend: function() {
            status.addClass("saic-loading").html('<span class="saico-loading"></span>').show()
        },
        success: function(data) {
            status.removeClass("saic-loading").html("").hide(), $container_comments.html(data), $container_comments.show(), jPages_SAIC(post_id, WDS_RSVP.jPagesNum)
        },
        error: function(jqXHR, textStatus, errorThrown) {
            clog("ajax error"), clog("jqXHR"), clog(jqXHR), clog("errorThrown"), clog(errorThrown)
        },
        complete: function(jqXHR, textStatus) {}
    }), !1
}

function insertComment_SAIC(post_id, num_comments) {
    var link_show_comments = jQuery("#saic-link-" + post_id),
        comment_form = jQuery("#commentform-" + post_id),
        status = jQuery("#saic-comment-status-" + post_id),
        formSubmit = jQuery("#saic-wrap-form-" + post_id),
        form_data = new FormData(comment_form[0]),
        btnSubmit = jQuery(".saic-wrap-submit");
    return form_data.append("action", "insert_comment"), form_data.append("nonce", WDS_RSVP.nonce), jQuery.ajax({
        type: "POST",
        dataType: "html",
        url: WDS_RSVP.ajaxurl,
        data: form_data,
        processData: !1,
        contentType: !1,
        beforeSend: function() {
            btnSubmit.hide(), status.addClass("saic-loading").html('<span class="saico-loading"></span>').show()
        },
        success: function(data, textStatus) {
            if (status.removeClass("saic-loading").html(""), data.startsWith("error-")) {
                let errorMessage = data.substring(6);
                status.html('<p class="saic-ajax-error">' + errorMessage + "</p>"), btnSubmit.show()
            } else status.html('<p class="saic-ajax-success">' + WDS_RSVP.thanksComment + "</p>"), link_show_comments.find("span").length && (num_comments = String(parseInt(num_comments, 10) + 1), link_show_comments.find("span").html(num_comments)), jQuery("ul#saic-container-comment-" + post_id).prepend(data).show(), jPages_SAIC(post_id, WDS_RSVP.jPagesNum, !0), formSubmit.hide()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            status.removeClass("saic-loading").html('<p class="saic-ajax-error" >' + WDS_RSVP.duplicateComment + "</p>")
        },
        complete: function(jqXHR, textStatus) {
            setTimeout((function() {
                status.removeClass("saic-loading").fadeOut(600)
            }), 2500)
        }
    }), !1
}

function jPages_SAIC(post_id, $numPerPage, $destroy) {
    if ("function" == typeof jQuery.fn.jPages) {
        var $idList = "saic-container-comment-" + post_id,
            $holder = "div.saic-holder-" + post_id,
            num_comments;
        jQuery("#" + $idList + " > li").length > $numPerPage && ($destroy && jQuery("#" + $idList).children().removeClass("animated jp-hidden"), jQuery($holder).show().jPages({
            containerID: $idList,
            previous: WDS_RSVP.textNavPrev,
            next: WDS_RSVP.textNavNext,
            perPage: parseInt($numPerPage, 10),
            minHeight: !1,
            keyBrowse: !0,
            direction: "forward",
            animation: "fadeIn"
        }))
    }
    return !1
}

function getUrlVars_SAIC(url) {
    for (var query, parts = url.substring(url.indexOf("?") + 1).split("&"), params = {}, i = 0; i < parts.length; i++) {
        var pair = parts[i].split("=");
        params[pair[0]] = pair[1]
    }
    return params
}

function rezizeBoxComments_SAIC(wrapper) {
    var widthWrapper;
    wrapper.outerWidth() <= 480 ? wrapper.addClass("saic-full") : wrapper.removeClass("saic-full")
}

function clog(msg) {
    console.log(msg)
}
jQuery(document).ready((function($) {
    $(".saic-wrap-comments").each((function(index, element) {
        var ids = $("[id='" + this.id + "']");
        ids.length > 1 && ids.slice(1).closest(".saic-wrapper").remove()
    })), $('.saic-container-form [name="comment_parent"], .saic-container-form [name="comment_post_ID"]').each((function(index, input) {
        $(input).removeAttr("id")
    })), "function" == typeof jQuery.fn.textareaCount && $(".saic-textarea").each((function() {
        var textCount = {
            maxCharacterSize: WDS_RSVP.textCounterNum,
            originalStyle: "saic-counter-info",
            warningStyle: "saic-counter-warn",
            warningNumber: 20,
            displayFormat: "#left"
        };
        $(this).textareaCount(textCount)
    })), "function" == typeof jQuery.fn.placeholder && $(".saic-wrap-form input, .saic-wrap-form textarea").placeholder(), "function" == typeof autosize && autosize($("textarea.saic-textarea")), $(".saic-wrapper").each((function() {
        rezizeBoxComments_SAIC($(this))
    })), $(window).resize((function() {
        $(".saic-wrapper").each((function() {
            rezizeBoxComments_SAIC($(this))
        }))
    })), $("body").on("click", "a.saic-link", (function(e) {
        e.preventDefault();
        var linkVars = getUrlVars_SAIC($(this).attr("href")),
            post_id = linkVars.post_id,
            num_comments = linkVars.comments,
            num_get_comments = linkVars.get,
            order_comments = linkVars.order;
        $("#saic-wrap-comment-" + post_id).slideToggle(200);
        var container_comment = $("#saic-container-comment-" + post_id);
        return container_comment.length && 0 === container_comment.html().length && getComments_SAIC(post_id, num_comments, num_get_comments, order_comments), !1
    })), $("a.saic-link").length && $("a.saic-link.auto-load-true").each((function() {
        $(this).click()
    })), $("input, select, textarea").focus((function() {
        $(this).removeClass("saic-error"), $(this).siblings(".saic-error-info").hide()
    })),
    // Start Edit Kode Tambahan Untuk Konfirmasi Kehadiran
        $(document).ready(function() {
            $('.saic-button').click(function() {
                var selectedValue = $(this).val();
                $('#attendance').val(selectedValue);

                if (selectedValue === 'present') {
                    // Tampilkan elemen tamu jika pilihan "present"
                    if (WDS_RSVP.guestMax == 1) {
                        $('#guest').val(1); // Jika guestMax = 1, atur nilai langsung ke 1
                    } else {
                        $('.saic-wrap-guest').show(); // Jika tidak, tampilkan elemen guest
                    }
                } else {
                    // Sembunyikan elemen tamu jika pilihan bukan "present"
                    $('.saic-wrap-guest').hide();
                }
            });

            document.querySelectorAll('.saic-button').forEach(button => {
                button.addEventListener('click', function() {
                    document.getElementById('attendance').value = this.value;
                    document.querySelectorAll('.saic-button').forEach(btn => btn.classList.remove('rvspSelect'));
                    this.classList.add('rvspSelect'); // Tambahkan kelas untuk tombol yang dipilih
                });
            });
        });
    // Disabled old WordPress admin-ajax.php submit listener
    // $("body").on("submit", ".saic-container-form form", function(e) { ... });
}));