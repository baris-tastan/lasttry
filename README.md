This is the URL of my Vercel deployment:

https://lasttry2139.vercel.app

An admin user credentials are:

    alice.admin@example.com
    securepassword123

    
A regular user credentials are:

    bobbuyer@example.com
    password456

I used Next.Js, because that was the easiest to find a tutorial on, and because that was created by Vercel I thought it would be the best option.
I used mongoDB and  as per the instructions.
I used tailwind and shadcn components for the UI.
I used auth.js for user authentication.
I used zod to create entity models.

If you are not logged in you can only browse the products and read the reviews.

If you are logged in as a regular user, you can comment on products,
you also have access to your own account page from the top right item.

If you are logged in as an admin user, you have two more options show up on the top right menu.
One is the products page, the other is the users page.
On the users page you can delete users, and add a user by clicking on top right button. You enter the details on the form and click create user.

On the product page you enter product details and click on create product.
You can also view and delete products from this page.

But roduct image can only be:

/images/shoe.jpeg
/images/gps.jpeg
/images/vinyl.jpeg
/images/antique.jpeg




