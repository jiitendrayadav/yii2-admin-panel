<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace app\assets;

use yii\web\AssetBundle;

/**
 * Main application asset bundle.
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class AppAsset extends AssetBundle
{   
    
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css',
        'comman/css/ionicons.min.css',
        'comman/css/dataTables.bootstrap.css',
        'comman/css/AdminLTE.min.css',
        'comman/css/skins/skin-black-light.min.css',
        'comman/css/skins/skin-black-light.css',
        'comman/css/blue.css',
        'comman/css/custom.css',
        'comman/css/buttons.dataTables.min.css',
        'comman/css/daterangepicker.css',
        'comman/plugins/fileinput/css/fileinput.min.css',
        'comman/plugins/fullcalendar/fullcalendar.min.css',
        'comman/jquery-ui/jquery-ui.min.css',
        'css/site.css',
    ];
    public $js = [
        'comman/js/jquery-ui.min.js',
        'comman/js/jquery.dataTables.min.js',
        'comman/js/dataTables.bootstrap.min.js',
        'https://cdn.datatables.net/buttons/1.2.2/js/dataTables.buttons.min.js',
        '//cdn.datatables.net/buttons/1.2.2/js/buttons.flash.min.js',
        '//cdnjs.cloudflare.com/ajax/libs/jszip/2.5.0/jszip.min.js',
        '//cdn.rawgit.com/bpampuch/pdfmake/0.1.18/build/pdfmake.min.js',
        '//cdn.rawgit.com/bpampuch/pdfmake/0.1.18/build/vfs_fonts.js',
        '//cdn.datatables.net/buttons/1.2.2/js/buttons.html5.min.js',
        '//cdn.datatables.net/buttons/1.2.2/js/buttons.print.min.js', 
        'comman/js/moment.min.js',
        'comman/js/daterangepicker.js',
        'comman/js/jquery.form-validator.min.js',
        'comman/js/app.min.js',
        'comman/js/icheck.min.js',
        'comman/ckeditor/ckeditor.js',
        'comman/ckeditor/adapters/jquery.js',
        'comman/plugins/moment/moment.min.js',
        'comman/plugins/fullcalendar/fullcalendar.min.js',
        'comman/plugins/fileinput/js/fileinput.min.js',
        'comman/js/demo.js',
        'comman/js/custom.js',

    ];
    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];

    public $jsOptions = array(
        // 'position' => \yii\web\View::POS_HEAD
    );
}
