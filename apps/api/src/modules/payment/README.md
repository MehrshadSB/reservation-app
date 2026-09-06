# Payment

Charges, deposits, refunds, and provider adapters.

Thin module for now: application, infrastructure, presentation only.
Payment policy that affects whether a booking can be confirmed should be
expressed through booking ports, not by importing this module's internals
from Booking Core.
