<script>
// JavaScript logic can go here if needed
</script>

<svelte:head>
  <title>Contact Luisa Jaime</title>
</svelte:head>



<!-- Contact Information -->
<section class="contact-info">
    <h1>Contact Luisa Jaime</h1>
    <p>You can reach me through the following methods:</p>
    <p>Email: <a href="mailto:luisajaime94@gmail.com">luisajaime94@gmail.com</a></p>
    <p>LinkedIn: <a href="https://www.linkedin.com/in/luisa-jaime-garcia/" target="_blank">Luisa Jaime LinkedIn</a></p>
    <p>Location: San Diego, CA</p>

    <!-- Optional Contact Form (if needed) -->
    <form action="submit_form.php" method="post">
        <label for="name">Name:</label><br>
        <input type="text" id="name" name="name" required><br><br>
        <label for="email">Email:</label><br>
        <input type="email" id="email" name="email" required><br><br>
        <label for="message">Message:</label><br>
        <textarea id="message" name="message" rows="5" required></textarea><br><br>
        <input type="submit" value="Send Message">
    </form>
</section>
