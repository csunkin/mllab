#!/usr/bin/env node
/**
 * Prebuild script: copies media assets from Hugo content directories
 * into the Next.js public/ folder so they are available at build time.
 *
 * Copies:
 *   content/authors/<slug>/avatar.*  →  public/authors/<slug>/avatar.*
 *   static/media/**                  →  public/media/**
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest))
  fs.copyFileSync(src, dest)
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return
  ensureDir(dest)
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath)
    } else {
      copyFile(srcPath, destPath)
    }
  }
}

// 1. Copy author avatars
const authorsDir = path.join(ROOT, 'content', 'authors')
const publicAuthorsDir = path.join(ROOT, 'public', 'authors')

if (fs.existsSync(authorsDir)) {
  for (const slug of fs.readdirSync(authorsDir)) {
    const authorDir = path.join(authorsDir, slug)
    if (!fs.statSync(authorDir).isDirectory()) continue
    for (const file of fs.readdirSync(authorDir)) {
      if (/^avatar\./i.test(file)) {
        const src = path.join(authorDir, file)
        const dest = path.join(publicAuthorsDir, slug, file)
        copyFile(src, dest)
        console.log(`Copied avatar: ${src} → ${dest}`)
      }
    }
  }
}

// 2. Copy static/media → public/media
const staticMedia = path.join(ROOT, 'static', 'media')
const publicMedia = path.join(ROOT, 'public', 'media')
copyDirRecursive(staticMedia, publicMedia)
console.log('Copied static/media → public/media')

// 3. Copy logo
const logoSrc = path.join(ROOT, 'mllab-logo.png')
const logoDest = path.join(ROOT, 'public', 'mllab-logo.png')
if (fs.existsSync(logoSrc)) {
  copyFile(logoSrc, logoDest)
  console.log('Copied mllab-logo.png → public/')
}

console.log('✓ copy-media.js done')
