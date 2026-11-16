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
        'psr_autoloading' => false,
        'function_declaration' => ['closure_fn_spacing' => 'none'],
    ])
    ->setFinder($finder);
