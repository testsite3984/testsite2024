// script to manage tag filtering
$(document).ready(function() {
    // toggle tags
    $('#toggleTagFilters').on('click', function() {
        var tagFilters = $('#tagFilters');
        if (tagFilters.is(':visible')) {
            tagFilters.hide();
            $('#clearFilters').hide();
        } else {
            tagFilters.show();
            $('#clearFilters').show();
        }
    });

    // initialize datatable
    var table = $('#myTable').DataTable({
        searching: true,
        pageLength: 50, // Default amount of entries shown
        lengthMenu: [50, 100, 150, 200, 1000], // Entries per page options
        language: {
            search: "",
            searchPlaceholder: "search audios"
        }
    });

    // read valid (non-duplicate, contains no colon, contains no slash) tags from table
    var tags = [];
    $('#myTable tbody tr').each(function() {
        $(this).find('td').each(function() {
            var tagText = $(this).text();
            var tagArray = tagText.match(/\[(.*?)\]/g);
            if (tagArray) {
                tagArray.forEach(function(tag) {
                    tag = tag.replace(/\[|\]/g, '').toLowerCase();
                    if (!tags.includes(tag) && !tag.includes(":") && !tag.includes("/")) {
                        tags.push(tag);
                    }
                });
            }
        });
    });

    // move gender tags to the front
    tags.sort(function(a, b) {
        if (a.includes("m4") && !b.includes("m4")) {
            return -1;
        } else if (!a.includes("m4") && b.includes("m4")) {
            return 1;
        } else {
            return a.localeCompare(b);
        }
    });

    displayTags(tags);

    $(document).on('click', '.filter-btn', function() {
        $(this).toggleClass('active');
        applyFilter();
    });

    function applyFilter() {
        table.draw();
    }

    // filter helper function
    $.fn.dataTable.ext.search.push(
        function(settings, data, dataIndex) {
            var activeTags = $('.filter-btn.active').map(function() {
                return $(this).text().toLowerCase();
            }).get();
            var rowText = data.join("").toLowerCase();
            var showRow = activeTags.every(function(tag) {
                return rowText.includes("[" + tag + "]");
            });
            return showRow;
        }
    );

    // clear tags
    $('#clearFilters').on('click', function() {
        $('.filter-btn.active').removeClass('active');
        table.draw();
    });

    // display valid tags
    function displayTags(tags) {
        $('#tagFilters').empty();
        tags.forEach(function(tag) {
            var button = $('<button>').text(tag).addClass('filter-btn').css({
                'background-color': '#cdbecf',
                'color': '#332c45',
                'border': 'none',
                'font-weight': 'bold',
                'font-size': '14px',
                'padding': '5px 10px',
                'border-radius': '5px',
                'margin-right': '10px',
                'margin-bottom': '10px'
            });
            $('#tagFilters').append(button);
        });
    }
});
