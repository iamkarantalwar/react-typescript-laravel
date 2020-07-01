**Requirements**
*  PHP 7.2
    
    For Ubuntu  : [PHP](https://tecadmin.net/install-php-7-on-ubuntu/)
    
    For Windows : [XAMPP](https://www.apachefriends.org/download.html)

**Setup**
1. Go to [localhost/phpmyadmin](localhost/phpmyadmin) and create a new Database naming: `carela`

2. Open terminal, run `git clone https://gitlab.com/ui-clients/taps.git` and run the following commands in it:

    `cd taps`
    
    `git checkout milestone-two`

    `composer install`

    `cp .env.example .env`

    `php artisan key:generate`

3. Open `.env` file and update

    `DB_DATABASE=carela`
    
    `DB_USERNAME=root`             // Change accordingly
    
    `DB_PASSWORD=root`             // For windows it may be empty or change accordingly
    
4. Run

    `composer dump-autoload`
    
    `php artisan storage:link`
    
    `php artisan migrate`
        
    `php artisan db:seed`

    `npm install`

    `npm run dev`
    
5. Serve the application using `php artisan serve`. Go to the browser, open: [localhost:8000](localhost:8000)

**Default Admin/User Credentials**
Email : admin@gmail.com
Password : admin
