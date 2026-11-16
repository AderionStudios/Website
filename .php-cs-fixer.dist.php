<?php

declare(strict_types=1);

$finder = PhpCsFixer\Finder::create()
    ->in(__DIR__ . '/api')
    ->name('*.php')
    ->notName('smtp_config.php')
    ->notName('discord_config.php');

return (new PhpCsFixer\Config())
    ->setRiskyAllowed(true)
    ->setRules([
        '@PSR12' => true,
        '@PhpCsFixer:risky' => true,
    ])
    ->setFinder($finder);
