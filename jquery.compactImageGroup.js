if (typeof jQuery === 'undefined') {
    throw new Error('jquery.compactImageGroup.js plugin requires jQuery');
}

(function ($) {
    $.fn.compactImageGroup = function (options) {
        var options = $.extend({
            maxRowHeight: 120,
            imagePadding: 0,
            imageBgColor: "transparent"
        }, options);
        var maxImageHeight = options.maxRowHeight - (options.imagePadding * 2);

        function compactImageGroup() {
            var group = $(this),
                    images = group.find("img"),
                    amountImage = images.size(),
                    imagesRatio = [],
                    amountUploadedImage = 0;
            
            if (typeof (amountImage) == "undefined" || amountImage == 0) {
                return;
            }

            setStyle();
            
            images.each(function () {
                //console.log("image size = " + $(this).width());
                if ($(this).height() > 24) {
                    amountUploadedImage++;
                    if (amountImage == amountUploadedImage) {
                        setImagesRatio(false);
                        execute();
                    }
                } else {
                    $(this).load(function () {
                        amountUploadedImage++;
                        if (amountImage == amountUploadedImage) {
                            setImagesRatio(true);
                            execute();
                        }
                    });
                }
            });

            function setStyle() {
                images.removeAttr("style").css({
                    display: "inline-block",
                    border: "none",
                    margin: "0 0 0 0",
                    "background-color": options.imageBgColor,
                    padding: options.imagePadding + "px",
                    "max-height": options.maxRowHeight + "px",
                    "max-width": "100%",
                    height: "auto!important",
                    width: "auto!important"
                });
            }

            function setImagesRatio(preload) {
                images.each(function () {
                    var ratio = preload ? this.naturalWidth / this.naturalHeight//Math.round((this.naturalWidth / this.naturalHeight) * 1000000000) / 1000000000
                            : $(this).width() / $(this).height();//Math.round(($(this).width() / $(this).height()) * 1000000000) / 1000000000;
                    imagesRatio.push(ratio);
                });
                //console.log("imagesRatio=" + imagesRatio);
            }

            function execute() {
                if (group.is(":hidden")) {
                    return;
                }

                var widthSum = 0,
                        startIndex = 0,
                        amountImageInRow = 0,
                        groupWidth = group.width();

                for (var stopIndex = 0; stopIndex < amountImage; stopIndex++) {
                    widthSum += Math.floor((maxImageHeight * imagesRatio[stopIndex]) * 1000000000) / 1000000000;
                    amountImageInRow++;
                    
                    if ((widthSum + (amountImageInRow * options.imagePadding * 2)) > groupWidth) {
                        var k = group.width() / widthSum,//Math.round((group.width() / widthSum) * 1000000000) / 1000000000,
                                inbuiltWidthSum = 0,
                                start = startIndex;

                        for (startIndex; startIndex <= stopIndex; startIndex++) {
                            images.eq(startIndex).css({
                                height: Math.floor((maxImageHeight * k) * 1000000000) / 1000000000,
                                width: "auto!important"
                            });
                            inbuiltWidthSum = inbuiltWidthSum + images.eq(startIndex).outerWidth();
                        }
                        var diff = groupWidth - inbuiltWidthSum;
                        
                        if (diff <= 0) {
                            var w = images.eq(stopIndex).width() + diff - 1;
                            images.eq(stopIndex).width(w);
                        } else {
                            for (var i = 0, j = start; i < diff - 1; i++, j++) {
                                if (j == stopIndex + 1) {
                                    j = start;
                                }
                                var w = images.eq(j).width() + 1;
                                images.eq(j).width(w);
                            }
                        }
                        
                        widthSum = amountImageInRow = 0;
                        startIndex = stopIndex + 1;

                    } else if ((stopIndex + 1) == amountImage) {
                        for (startIndex; startIndex <= stopIndex; startIndex++) {
                            images.eq(startIndex).css({
                                height: maxImageHeight
                            });
                        }
                    }
                }
            }
        }

        return this.each(compactImageGroup);
    };
})(jQuery);