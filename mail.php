<?php
	$sendto = "your_mail@gmail.com";
	$subject = "Заявка с сайта <Название Сайта>";

	$mail = $_POST['mail'];

	$headers  = "From: <От кого>\r\n";
	$headers .= "Reply-To: <Кому>\r\n";
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-type: text/html;charset=utf-8 \r\n";

	$msg  = "<html><body style='font-family:Arial,sans-serif;'>";
	$msg .= "<h2 style='font-weight:bold;border-bottom:1px dotted #ccc;'>$subject</h2>\r\n";

    $msg .= "<p><strong>E-mail: </strong> ".$mail."</p>\r\n";
	if($_REQUEST['tovar'] != null){
        $msg .= "<p><strong style='font-weight:bold'>Наименование товара/формы: </strong> ".$tovar."</p>\r\n";
    }
	$msg .= "</body></html>";

    mail($sendto, $subject, $msg, $headers);
?>
