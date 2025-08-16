const CUSTOM_MAP: google.maps.MapTypeStyle[] = [
    {"featureType":"all","elementType":"all","stylers":[{"visibility":"on"}]},
    {"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"},{"saturation":"-100"}]},
    {"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40},{"visibility":"off"}]},
    {"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"color":"#000000"},{"lightness":16}]},
    {"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},

    // Administrative
    {"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},
    {"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},

    // LAND → maroon-ish
    {"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},
    {"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#7a1f3d"}]},
    {"featureType":"landscape","elementType":"geometry.stroke","stylers":[{"color":"#5b152d"}]},
    {"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"color":"#7a1f3d"}]},

    // POIs (match land tone, subtle)
    {"featureType":"poi","elementType":"geometry","stylers":[{"lightness":21}]},
    {"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#7a1f3d"}]},
    {"featureType":"poi","elementType":"geometry.stroke","stylers":[{"color":"#5b152d"}]},

    // ROADS (light so pins/plane pop)
    {"featureType":"road","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#cfc6c9"}]},
    {"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#cfc6c9"}]},
    {"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#e4dadd"}]},
    {"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#e4dadd"},{"lightness":17}]},
    {"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#d2c6c9"},{"lightness":29},{"weight":0.2}]},
    {"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#cfc6c9"}]},
    {"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#cfc6c9"}]},
    {"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#cfc6c9"}]},
    {"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#e9e4e6"}]},
    {"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#e9e4e6"}]},
    {"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#e9e4e6"}]},

    // Transit off
    {"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},

    // WATER → blue
    {"featureType":"water","elementType":"all","stylers":[{"color":"#2aa7ff"},{"visibility":"on"}]},
    {"featureType":"water","elementType":"geometry","stylers":[{"color":"#2aa7ff"},{"lightness":17}]},
    {"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#2aa7ff"}]},
    {"featureType":"water","elementType":"geometry.stroke","stylers":[{"color":"#2aa7ff"}]},
    {"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]}
];

export default CUSTOM_MAP;
