<?php
    if(is_dir('pages')){
        $dir = opendir(pages);
        $href = 'pages';
    } else{
        $dir = opendir(__DIR__);
        $href = '';
    }
    $i = 0;
    $link = '';
    while (false !== ($file = readdir($dir))) {
        $i++;
        if (strpos($file, '.html',1) ) {
            $link .= '<a href="'.$href.'/'.$file.'">'.$file.'</a>';
        }
    }
    echo $link;
?>
