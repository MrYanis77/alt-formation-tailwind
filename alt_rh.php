<?php
/**
 * alt_rh.php — Point d'entrée legacy (redirige vers pages/alternance.php)
 *
 * Ce fichier est conservé pour assurer la compatibilité avec les anciens liens.
 * La page Alternance a été refactorisée dans pages/alternance.php.
 *
 * Redirection HTTP 301 (permanente) vers la nouvelle URL.
 *
 * @package AltFormationsRH
 * @deprecated Utiliser pages/alternance.php directement.
 */

// Redirection permanente (301) vers la page refactorisée
header('HTTP/1.1 301 Moved Permanently');
header('Location: pages/alternance.php');
exit;