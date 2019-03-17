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
    ];
    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];
}
