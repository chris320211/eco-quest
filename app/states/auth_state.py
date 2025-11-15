import reflex as rx
import bcrypt
from app.states.base_state import BaseState


class AuthState(BaseState):
    """State for authentication (login and registration)."""

    error_message: str = ""
    is_loading: bool = False

    def _hash_password(self, password: str) -> str:
        """Hash a password for storing."""
        return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

    def _verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a stored password against one provided by user"""
        return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

    @rx.event
    async def handle_registration(self, form_data: dict):
        """Handle user registration."""
        self.is_loading = True
        yield
        username = form_data.get("username", "").strip()
        password = form_data.get("password", "")
        if not username or not password:
            self.error_message = "Username and password cannot be empty."
            self.is_loading = False
            return
        if self._get_user(username):
            self.error_message = f"Username '{username}' already exists."
            self.is_loading = False
            return
        password_hash = self._hash_password(password)
        self.users.append({"username": username, "password_hash": password_hash})
        self.current_user = username
        self.is_loading = False
        self.error_message = ""
        yield rx.redirect("/dashboard")
        return

    @rx.event
    async def handle_login(self, form_data: dict):
        """Handle user login."""
        self.is_loading = True
        yield
        username = form_data.get("username", "").strip()
        password = form_data.get("password", "")
        user = self._get_user(username)
        if user and self._verify_password(password, user["password_hash"]):
            self.current_user = username
            self.is_loading = False
            self.error_message = ""
            yield rx.redirect("/dashboard")
            return
        else:
            self.error_message = "Invalid username or password."
            self.is_loading = False
            return

    @rx.event
    def set_error_message(self, message: str):
        self.error_message = message