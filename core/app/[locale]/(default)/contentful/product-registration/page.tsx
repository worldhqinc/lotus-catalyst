export default function ProductRegistration() {
  return (
    <div>
      <h1>Product Registration</h1>
      <form>
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
