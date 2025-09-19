#!/bin/bash

# Script to remove CSS imports and usages from all TypeScript files
# This script handles the bulk removal of CSS from Lit components

echo "Starting CSS removal from all TypeScript files..."

# Function to remove css import and $LitElement css usage from a file
remove_css_from_file() {
    local file="$1"
    echo "Processing: $file"

    # Create backup
    cp "$file" "$file.backup"

    # Remove css import from lit (preserve other imports)
    sed -i '' 's/import { css, html/import { html/g' "$file"
    sed -i '' 's/import { css, html,/import { html,/g' "$file"
    sed -i '' 's/, css//g' "$file"

    # Handle $LitElement(css`...`) pattern - this is complex multiline
    # For now, mark files that need manual processing
    if grep -q '\$LitElement(css`' "$file"; then
        echo "NEEDS_MANUAL: $file" >> /tmp/css_manual_files.txt
    fi

    # Handle TailwindElement(css`...`) pattern
    if grep -q 'TailwindElement(css`' "$file"; then
        echo "NEEDS_MANUAL: $file" >> /tmp/css_manual_files.txt
    fi

    # Handle static styles = css`` pattern
    if grep -q 'static styles.*=.*css`' "$file"; then
        echo "NEEDS_MANUAL: $file" >> /tmp/css_manual_files.txt
    fi
}

# Clear the manual processing file
rm -f /tmp/css_manual_files.txt

# Find all TypeScript files with css imports
echo "Finding all TypeScript files with CSS imports..."
find /Users/mohasan/schmancy -name "*.ts" -exec grep -l "import.*css.*from.*lit" {} \; > /tmp/css_files.txt

# Process each file
while IFS= read -r file; do
    remove_css_from_file "$file"
done < /tmp/css_files.txt

echo "Batch processing complete!"
echo "Files requiring manual processing saved to: /tmp/css_manual_files.txt"

if [ -f /tmp/css_manual_files.txt ]; then
    echo "Manual processing needed for $(wc -l < /tmp/css_manual_files.txt) files:"
    cat /tmp/css_manual_files.txt
fi