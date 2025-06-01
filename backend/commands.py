from .models import db
import os
import shutil


def set_commands(app):
    @app.cli.command("reset_db")
    def reset_db():
        with app.app_context():
            try:
                print("Dropping all tables...")
                db.drop_all()

                migrations_dir = os.path.join(os.getcwd(), 'migrations')
                if os.path.exists(migrations_dir):
                    print("Deleting migrations...")
                    shutil.rmtree(migrations_dir)

                print("Recreating tables...")
                db.create_all()

                print("Initializing migrations...")
                os.system('flask db init')

                print("Generating migrations...")
                os.system('flask db migrate -m "Initial migration after reset"')

                print("Applying migrations...")
                os.system('flask db upgrade')

                print("Database reset completed!")
            except Exception as e:
                print(f"An error occurred: {e}")
